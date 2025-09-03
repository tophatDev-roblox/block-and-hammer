import { Client, createRemotes, namespace, remote, Server } from '@rbxts/remo';

import type { UserSettings } from 'shared/user-settings';

import { Accessories } from 'shared/accessories';
import { InputType } from 'shared/input-type';
import { matches } from 'shared/matches';

export const Remotes = createRemotes({
	character: namespace({
		fullReset: remote<Server>().returns<true>(),
		unload: remote<Server>(),
	}),
	player: namespace({
		updateInputType: remote<Server, [inputType: InputType]>((input) => matches(input, [InputType.Desktop, InputType.Touch])),
		awardedBadge: remote<Client, [badgeId: number]>(),
		loadSettings: remote<Client, [userSettings: UserSettings.Value]>(),
		updateSettings: remote<Server, [userSettings: UserSettings.Value]>(),
		getInventoryInfo: remote<Server>().returns<[Accessories.EquippedAccessories, Color3]>(),
		applyAccessories: remote<Server, [accessories: Accessories.EquippedAccessories]>(Accessories.EquippedAccessories),
		updateBoughtAccessories: remote<Client, [boughtAccessories: Set<string>]>(),
	}),
	chat: namespace({
		sendSystemMessage: remote<Client, [message: string]>(),
	}),
});
