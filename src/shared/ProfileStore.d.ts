export const enum Constant {
	AutoSavePeriod = 'AUTO_SAVE_PERIOD',
	LoadRepeatPeriod = 'LOAD_REPEAT_PERIOD',
	FirstLoadRepeat = 'FIRST_LOAD_REPEAT',
	SessionSteal = 'SESSION_STEAL',
	AssumeDead = 'ASSUME_DEAD',
	StartSessionTimeout = 'START_SESSION_TIMEOUT',
	CriticalStateErrorCount = 'CRITICAL_STATE_ERROR_COUNT',
	CriticalStateErrorExpire = 'CRITICAL_STATE_ERROR_EXPIRE',
	CriticalStateExpire = 'CRITICAL_STATE_EXPIRE',
	MaxMessageQueue = 'MAX_MESSAGE_QUEUE',
}

export const enum LastSaveReason {
	Manual = 'Manual',
	External = 'External',
	Shutdown = 'Shutdown',
}

export const enum DataStoreState {
	NotReady = 'NotReady',
	NoInternet = 'NoInternet',
	NoAccess = 'NoAccess',
	Access = 'Access',
}

export default class ProfileStore<T extends object = {}> {
	/** When the Roblox is shutting down this value will be set to `true` and most methods will silently fail. */
	static readonly IsClosing: boolean;
	/** After an excessive amount of DataStore calls fail this value will temporarily be set to `true` until the DataStore starts operating normally again. Might be useful for analytics or notifying players in-game of possible service disturbances. */
	static readonly IsCriticalState: boolean;
	/**
	 * A signal for DataStore error logging. Example:
	 * ```ts
	 * ProfileStore.OnError.Connect((errorMessage, storeName, profileKey) => {
	 * 	print(`DataStore error (Store:${storeName};Key:${profileKey}): ${errorMessage}`);
	 * });
	 * ```
	 */
	static readonly OnError: RBXScriptSignal<(message: string, storeName: string, profilekey: string) => void>;
	/**
	 * A signal for events when a DataStore key returns a value that has all or some of it's profile components set to invalid data types. E.g., accidentally setting `Profile.Data` to a non table value. Example:
	 * ```ts
	 * ProfileStore.OnOverwrite.Connect((storeName, profileKey) => {
	 * 	print(`Overwrite has occurred for Store:${storeName}, Key:${profileKey}`);
	 * });
	 * ```
	 */
	static readonly OnOverwrite: RBXScriptSignal<(storeName: string, profileKey: string) => void>;
	/**
	 * A signal that is called whenever `ProfileStore.IsCriticalState` changes. Example:
	 * ```ts
	 * ProfileStore.OnCriticalToggle:Connect((isCritical) => {
	 * 	if (isCritical === true) {
	 * 		print(`ProfileStore entered critical state`);
	 * 	} else {
	 * 		print(`ProfileStore critical state is over`);
	 * 	}
	 * });
	 */
	static readonly OnCriticalToggle: RBXScriptSignal<(isCritical: boolean) => void>;
	/**
	 * Indicates ProfileStore's access to the DataStore. If at first check `ProfileStore.DataStoreState` is `"NotReady"`, it will eventually change to one of the other 3 possible values (`NoInternet`, `NoAccess` or `Access`) and never change again. `"Access"` means `ProfileStore` can write to the DataStore.
	 */
	static readonly DataStoreState: DataStoreState;
	/**
	 * `ProfileStore` objects expose methods for reading and writing to profiles. Equivalent of [:GetDataStore()](https://create.roblox.com/docs/reference/engine/classes/DataStoreService#GetDataStore) in Roblox [DataStoreService](https://create.roblox.com/docs/reference/engine/classes/DataStoreService) API.
	 */
	static New<T extends object>(this: void, storeName: string, template?: T): ProfileStore<T>;
	/**
	 * A feature for experienced developers who understand how ProfileStore works for changing internal constants without having to fork the ProfileStore project.
	 */
	static SetConstant(this: void, name: Constant, value: number): void;
	
	/**
	 * ```ts
	 * const PlayerStore = ProfileStore.New("PlayerData", {});
	 * 
	 * // This profile would be saved to the DataStore:
	 * const LiveProfile = PlayerStore.StartSessionAsync("profile_key");
	 * LiveProfile.Data.Value = 1;
	 * LiveProfile.EndSession();
	 * 
	 * // This profile does not load data from the DataStore
	 * // nor save data to the DataStore:
	 * // (This data will disappear after the game server shuts down)
	 * const MockProfile = PlayerStore.Mock.StartSessionAsync("profile_key");
	 * MockProfile.Data.Value = 1;
	 * MockProfile.EndSession();
	 * ```
	 * `ProfileStore.Mock` is a reflection of methods available in the `ProfileStore`, but said methods will now operate on profiles stored on a separate "fake" DataStore that will be forgotten when the game server shuts down. Profiles loaded using the same key from `ProfileStore` and `ProfileStore.Mock` will be different profiles because the regular and mock versions of a `ProfileStore` are isolated from each other
	 * 
	 * `ProfileStore.Mock` is useful for customizing your testing environment in cases where you want to [enable Roblox API services](https://create.roblox.com/docs/cloud-services/data-stores#enable-studio-access) in studio, but don't want ProfileStore to save to live keys:
	 * ```ts
	 * import { RunService } from "@rbxts/services";
	 * 
	 * let PlayerStore = ProfileStore.New("PlayerData", {});
	 * if (RunService.IsStudio() === true) {
	 * 	PlayerStore = PlayerStore.Mock;
	 * }
	 * ```
	 */
	public Mock: ProfileStore<T>;
	/** The name of the DataStore that was defined as the first argument of `ProfileStore.New()`. */
	public readonly Name: string;
	/**
	 * Starts a session for a profile. If other servers call this method using the same `profileKey` they would notify the server that currently owns the session to make a final save before letting another server acquire the session. While a session is active you can expect any changes to `Profile.Data` to be saved. You can find out whether a session has ended by checking `Profile.IsActive() === true` or by listening to `Profile.OnSessionEnd`. You must always call `Profile.EndSession()` after you're done working with a profile as failing to do so will make the game perform more and more DataStore requests.
	 * 
	 * The second optional argument to `ProfileStore.StartSessionAsync()` is a table with additional rules for the session start request:
	 * - `Cancel` - If set to a function, the function will be called several times by ProfileStore to check whether the profile session is still needed. If the profile is no longer needed, the Cancel function should return `true`. The Cancel argument would be useful in rare cases where the DataStores are unresponsive and a player leaves before a session was started allowing ProfileStore to stop making additional requests to the DataStore. Using the `Cancel` argument also disables the default ProfileStore session start timeout as the developer would decide when the profile is no longer needed.
	 * - `Steal` - (e.g. `{ Steal: true }`) If set to `true`, doesn't let an active session make final changes to `Profile.Data` and immediately starts a session on the server calling `ProfileStore.StartSessionAsync()` with this argument. **DO NOT USE THIS ARGUMENT FOR LOADING PLAYER DATA NORMALLY** - The `Steal` argument bypasses session locks which are needed for item "dupe" prevention. This argument is only useful for debugging.
	 */
	public StartSessionAsync(profileKey: string, params?: { Cancel?: () => boolean, Steal?: boolean }): Profile<T> | undefined;
	/**
	 * Sends a message to a profile regardless of whether a server has started a session for it. Each `ProfileStore.MessageAsync()` call will use one `.UpdateAsync()` call for sending the message and another `.UpdateAsync()` call on the server that currently has a session started for the profile - This means that `ProfileStore.MessageAsync()` is only to be used for when handling critical data like **gifting paid items to in-game friends that may or may not be online at the moment**. If you don't mind the possibility of your messages failing to deliver, use [MessagingService](https://create.roblox.com/docs/reference/engine/classes/MessagingService) instead. See `Profile.MessageHandler()` to learn how to receive messages.
	 */
	public MessageAsync(profileKey: string, message: any): boolean;
	/**
	 * Attempts to load the latest profile version (or a specified version via the version argument) from the DataStore without starting a session. Returned `Profile` will not auto-save and you won't have to call `.EndSession()` for it. Data in the returned Profile can be edited to create a payload which can be saved via `Profile.SetAsync()`. If there's no data saved in the DataStore under a provided `profileKey`, `ProfileStore.GetAsync()` will return `undefined`.
	 * 
	 * `.GetAsync()` is the the preferred way of reading player data without editing it.
	 */
	public GetAsync(profileKey: string): Profile<T>;
	public GetAsync(profileKey: string, version: string): Profile<T> | undefined;
	/**
	 * Creates a profile version query using [DataStore:ListVersionsAsync() (Official documentation)](https://create.roblox.com/docs/reference/engine/classes/DataStore#ListVersionsAsync). Results are retrieved through `VersionQuery:NextAsync()`. Date definitions are easier with the [DateTime (Official documentation)](https://create.roblox.com/docs/reference/engine/datatypes/DateTime) library. User defined day and time will have to be converted to [Unix time (Wikipedia)](https://en.wikipedia.org/wiki/Unix_time) while taking their timezone into account to expect the most precise results, though you can be rough and just set the date and time in the UTC timezone and expect a maximum margin of error of 24 hours for your query results.
	 * 
	 * **Examples of query arguments:**
	 * - Pass `undefined` for `sortDirection`, `minDate`, and `maxDate` to find the oldest available version
	 * - Pass `Enum.SortDirection.Descending` for `sortDirection`, `undefined` for `minDate` and `maxDate` to find the most recent version.
	 * - Pass `Enum.SortDirection.Descending` for `sortDirection`, `undefined` for `minDate`, and `DateTime` defining a time before an event (e.g. two days earlier before your game unrightfully stole 1,000,000 coins from a player) for `maxDate` to find the most recent version of a `Profile` that existed before said event.
	 * 
	 * **Case example: "I lost all of my coins on August 14th!"**
	 * ```ts
	 * // Get a ProfileStore object with the same arguments you passed to the
	 * //  ProfileStore that loads player Profiles:
	 * const PlayerStore = ProfileStore.New("PlayerData", {});
	 * 
	 * // If you can't figure out the exact time and timezone the player lost coins
	 * //  in on the day of August 14th, then your best bet is to try querying
	 * //  UTC August 13th. If the first entry still doesn't have the coins - 
	 * //  try a new query of UTC August 12th and etc.
	 * const maxDate = DateTime.fromUniversalTime(2021, 08, 13); // UTC August 13th, 2021
	 * 
	 * const query = PlayerStore.VersionQuery(
	 *   "Player_2312310", // The same profile key that gets passed to .LoadProfileAsync()
	 *   Enum.SortDirection.Descending,
	 *   undefined,
	 *   maxDate,
	 * );
	 * 
	 * // Get the first result in the query:
	 * const profile = query.NextAsync();
	 * if (profile !== undefined) {
	 *   profile.SetAsync() // This method does the actual rolling back;
	 *     // Don't call this method until you're sure about setting the latest
	 *     // version to a copy of the previous one
	 * 
	 *   print("Rollback success!");
	 *   print(profile.Data) // You'll be able to surf table contents if
	 *     // you're running this code in studio with access to API services
	 *     // enabled and have expressive output enabled; If the printed
	 *     // data doesn't have the coins, you'll want to change your
	 *     // query parameters.
	 * } else {
	 *   print("No version to rollback to");
	 * }
	 * ```
	 */
	public VersionQuery(profileKey: string, sortDirection?: Enum.SortDirection, minDate?: DateTime | number, maxDate?: DateTime | number): VersionQuery<T>;
	/**
	 * You can use `.RemoveAsync()` to erase data from the DataStore. In live Roblox servers `.RemoveAsync()` must be used on profiles created through `ProfileStore.Mock` after `Profile.EndSession()` and it's known that the `Profile` will no longer be loaded again.
	 */
	public RemoveAsync(profileKey: string): boolean;
}

export class Profile<T extends object> {
	/**
	 * This is the data that would resemble player progress or other data you wish to save to the [DataStore](https://create.roblox.com/docs/cloud-services/data-stores#enable). Changes to `Profile.Data` are guaranteed to save as long as you do so after checking for the condition `Profile.IsActive() === true` or before the signal `Profile.OnSessionEnd` is triggered. The result of `Profile.IsActive()` can change at any moment, so critical data should be stored to `Profile.Data` immediately after checking without yielding (e.g. `task.wait()`). If needed, you may set `Profile.Data` to a new table reference (e.g. `Profile.Data = {}`). When `Profile.IsActive()` returns `false` changes to `Profile.Data` are no longer stored to the [DataStore](https://create.roblox.com/docs/cloud-services/data-stores).
	 */
	public Data: T;
	/**
	 * This is a version of `Profile.Data` that has been successfully stored to the DataStore. Useful for verifying what particular data has been saved, or for securely handling developer product purchases.
	 */
	public readonly LastSavedData: T;
	/**
	 * A [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time) of when the profile was created.
	 */
	public readonly FirstSessionTime: number;
	/**
	 * Amount of times a session has been started for this profile.
	 */
	public readonly SessionLoadCount: number;
	/**
	 * This value never changes after a profile object is created. After you start a session for a profile, the `Profile.Session` will be equal to a `table` with it's `PlaceId` and `JobId` members set to the server you started the session on. After you read a profile using `ProfileStore.GetAsync()`, `Profile.Session` may be equal to `undefined` or a `table` with it's `PlaceId` and `JobId` members set to the server that currently has a session started for the profile.
	 */
	public readonly Session: { PlaceId: number, JobId: string } | undefined;
	/**
	 * A table that gets saved as [Metadata (Official documentation)](https://create.roblox.com/docs/cloud-services/data-stores#metadata) of a DataStore key belonging to the profile. The way this table is saved is equivalent to using `DataStoreSetOptions.SetMetaData(Profile.RobloxMetaData)` and passing the `DataStoreSetOptions` object to a `.SetAsync()` call, except changes will truly get saved on the next auto-save cycle or when the profile session is ended. Info on Roblox metadata limits [can be found here](https://create.roblox.com/docs/cloud-services/data-stores/error-codes-and-limits#metadata-limits).
	 */
	public RobloxMetaData: any;
	/**
	 * User ids associated with this profile. Entries must be added with `Profile.AddUserId()` and removed with `Profile.RemoveUserId()`.
	 */
	public readonly UserIds: Array<number>;
	/**
	 * The [DataStoreKeyInfo (Official documentation)](https://create.roblox.com/docs/reference/engine/classes/DataStoreKeyInfo) instance related to this profile.
	 */
	public KeyInfo: DataStoreKeyInfo;
	/**
	 * ```ts
	 * Profile.OnSave.Connect(() => {
	 * 	print("Profile.Data is about to be saved to the DataStore");
	 * });
	 * ```
	 * A signal that is fired right before whenever changes to `Profile.DataStore` are saved to the DataStore. Changes to `Profile.Data` are expected to save when done at the moment of `Profile.OnSave` firing, but this guarantee is no longer valid after yielding (e.g. using `task.wait()` or `.WaitForChild()`) and the condition `Profile.IsActive() === true` would have to be used instead. `Profile.OnSave` will be fired before every auto-save, before a manual save caused by `Profile.Save()`, and before a final save after a session has been ended.
	 */
	public readonly OnSave: RBXScriptSignal<() => void>;
	/**
	 * ```ts
	 * Profile.OnLastSave.Connect((reason) => {
	 * 	print(`Profile.Data is about to be saved to the DataStore for the last time; Reason: {reason}`);
	 * });
	 * ```
	 * A signal that is fired right before changes to `Profile.Data` are saved to the DataStore for the last time. Changes to `Profile.Data` are expected to save when done at the moment of `Profile.OnLastSave` firing, but this guarantee is no longer valid after yielding (e.g. using `task.wait()` or `:WaitForChild()`). `Profile.OnLastSave` will be fired after a session has ended in one of three ways:
	 * - `"Manual"` - Developer code called `Profile.EndSession()`
	 * - `"External"` - Another server started a session for the same profile
	 * - `"Shutdown"` - The profile session has been ended automatically due to the server shutting down
	 * One of `Profile.OnLastSave` uses is giving "logout penalties" where a player may receive punishment for closing the game at the wrong time. Example:
	 * ```ts
	 * let InCombat = false;
	 * // ...
	 * Profile.OnLastSave.Connect((reason) => {
	 * 	if (reason !== "Shutdown") {
	 * 		print("The cause of the session ending is not due to a server shutdown");
	 * 		
	 * 		// If you didn't want the player to logout at this particular moment,
	 * 		// this should be where you'd penalize the player. e.g.:
	 * 		if (InCombat === true) {
	 * 			Profile.Data.Coins -= 100;
	 * 		}
	 * 	}
	 * });
	 * ```
	 */
	public readonly OnLastSave: RBXScriptSignal<(reason: LastSaveReason) => void>;
	/**
	 * The `Profile.OnSessionEnd` signal can be fired after the developer calls `Profile.EndSession()`, another server calls `ProfileStore.StartSessionAsync()` for the same profile, or when the server is shutting down. After the `Profile.OnSessionEnd` signal is fired, no further changes to `Profile.Data` should be made. `Profile.OnSessionEnd` will fire even when a profile session is stolen, whereas `Profile.OnLastSave` would not. In some cases it would be preferable to kick the player from the game when this signal is fired:
	 * ```ts
	 * Profile.OnSessionEnd.Connect(() => {
	 * 	player.Kick(`Your data has been loaded on another server - please rejoin`);
	 * });
	 * ```
	 */
	public readonly OnSessionEnd: RBXScriptSignal<() => void>;
	/**
	 * ```ts
	 * Profile.OnAfterSave.Connect((last_saved_data) => {
	 * 	print("Profile.Data has been successfully saved to the DataStore:", last_saved_data);
	 * });
	 * ```
	 * This signal will fire every time after profile data has been accessed by [`GlobalDataStore.UpdateAsync()`](https://create.roblox.com/docs/reference/engine/classes/GlobalDataStore#UpdateAsync). After this signal is fired, the values `Profile.LastSavedData` and `Profile.KeyInfo` will have been changed - `Profile.LastSavedData` can be used to verify which particular changes to `Profile.DataStore` have been successfully saved to the DataStore.
	 */
	public readonly OnAfterSave: RBXScriptSignal<() => void>;
	/**
	 * The `ProfileStore` object that was used to create this profile.
	 */
	public readonly ProfileStore: ProfileStore<T>;
	/**
	 * The DataStore key of this profile. This is the first passed argument to `ProfileStore.StartSessionAsync()` or `ProfileStore.GetAsync()`.
	 */
	public readonly Key: string;
	/**
	 * If `Profile.IsActive()` returns `true`, changes to `Profile.Data` will be saved - this guarantee will no longer be valid after yielding (e.g. using `task.wait()` or `.WaitForChild()`). When implementing in-game trading, you may make changes to two profiles immediately without yielding after `Profile.IsActive()` returns `true` for the two profiles.
	 */
	public IsActive(): boolean;
	/**
	 * Fills in missing variables inside `Profile.Data` from a template table that was provided as a second argument to `ProfileStore.New()`. `Profile.Reconcile()` can be useful if you're making changes to your data template over the course of your game's development.
	 */
	public Reconcile(): void;
	/**
	 * Stops auto-saving for this profile and saves `Profile.Data` to the DataStore for the last time. Call this method after you're done working with the `Profile` object created by `ProfileStore.StartSessionAsync()`.
	 * ```ts
	 * Players.PlayerRemoving:Connect((player) => {
	 * 	const profile = Profiles.get(player); // Assuming `Profiles` is of type `Map<Player, Profile<T>>`
	 * 	if (profile !== undefined) {
	 * 		profile.EndSession();
	 * 		Profiles.set(player, undefined);
	 * 	}
	 * })
	 * ```
	 */
	public EndSession(): void;
	/**
	 * Associates a `UserId` with the profile. Multiple users can be associated with a single profile by calling this method for each individual `UserId`. The primary use of this method is to comply with GDPR (The right to erasure). More information in [official documentation](https://create.roblox.com/docs/cloud-services/data-stores#metadata).
	 */
	public AddUserId(userId: number): void;
	/**
	 * Unassociates a `UserId` with the profile.
	 */
	public RemoveUserId(userId: number): void;
	/**
	 * Sets a function that will handle existing and future incoming messages sent to this profile by `ProfileStore.MessageAsync()`. The message argument is a `table` that was passed as the second argument to `ProfileStore.MessageAsync()`. The `processed` argument is a function that must be called to let ProfileStore know this message has been processed. If a message is not processed by calling `processed()`, ProfileStore will continue to iterate through other functions passed to `Profile.MessageHandler()` and will broadcast the same message. Unprocessed messages will be broadcasted to new functions passed to `Profile.MessageHandler()` and will continue to do so when a profile session is started another time (e.g. after a player joins the game again) until `processed()` is finally called.
	 */
	public MessageHandler(callback: (message: any, processed: () => void) => void): void;
	/**
	 * Calling `Profile.Save()` will immediately save `Profile.Data` to the DataStore when a profile session is still active (`Profile:IsActive()` returns `true`). `Profile.Data` is already automatically saved to the DataStore on auto-saves and when the profile session is ended with `Profile.EndSession()`, so `Profile.Save()` should only be used for critical moments like ensuring data related to [Developer Product](https://create.roblox.com/docs/production/monetization/developer-products) purchases are saved before a server crash could occur. The cost of calling `Profile.Save()` is one [`.UpdateAsync()`](https://create.roblox.com/docs/reference/engine/classes/GlobalDataStore#UpdateAsync) call - see the official documentation on [DataStore limits](https://create.roblox.com/docs/cloud-services/data-stores/error-codes-and-limits#server-limits) to evaluate your use case.
	 */
	public Save(): void;
	/**
	 * Saves `Profile.Data` of a profile loaded with `ProfileStore.GetAsync()` to the DataStore disregarding any active sessions. If there was a server that had an active session for that profile - that session will be ended.
	 */
	public SetAsync(): void;
}

declare class VersionQuery<T extends object> {
	public NextAsync(): Profile<T> | undefined;
}
