import type ProfileStore from '.';

type LastSaveReason =
	| 'Manual'
	| 'External'
	| 'Shutdown';

declare class Profile<T extends object> {
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

export default Profile;
