import { Client, createRemotes, remote, Server } from '@rbxts/remo';

import type { UserSettings } from 'shared/user-settings';

import { InputType } from 'shared/input-type';
import { matches } from 'shared/matches';

export const Remotes = createRemotes({
	fullReset: remote<Server>().returns<true>(),
	unloadCharacter: remote<Server>(),
	sendSystemMessage: remote<Client, [message: string]>(),
	updateInputType: remote<Server, [inputType: InputType]>((input) => matches(input, [InputType.Desktop, InputType.Touch, InputType.Controller])),
	loadSettings: remote<Client, [userSettings: UserSettings.Value]>(),
	updateSettings: remote<Server, [userSettings: UserSettings.Value]>(),
});
