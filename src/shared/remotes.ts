import { Client, createRemotes, remote, Server } from '@rbxts/remo';

import type { UserSettings } from 'shared/user-settings';

import { Accessories } from 'shared/accessories';
import { InputType } from 'shared/input-type';
import { matches } from 'shared/matches';

export const Remotes = createRemotes({
	fullReset: remote<Server>().returns<true>(),
	unloadCharacter: remote<Server>(),
	sendSystemMessage: remote<Client, [message: string]>(),
	updateInputType: remote<Server, [inputType: InputType]>((input) => matches(input, [InputType.Desktop, InputType.Touch])),
	loadSettings: remote<Client, [userSettings: UserSettings.Value]>(),
	updateSettings: remote<Server, [userSettings: UserSettings.Value]>(),
	applyAccessories: remote<Server, [accessories: Accessories.EquippedAccessories]>(Accessories.EquippedAccessories),
	updateBoughtAccessories: remote<Client, [boughtAccessories: Set<string>]>(),
	getInventoryInfo: remote<Server>().returns<[Accessories.EquippedAccessories, Color3]>(),
});
