import { StarterGui } from '@rbxts/services';

import { atom, effect } from '@rbxts/charm';
import { setTimeout } from '@rbxts/set-timeout';

export namespace CoreGuis {
	export const chatAtom = atom<boolean>(false);
	export const playerListAtom = atom<boolean>(false);
	export const capturesAtom = atom<boolean>(false);
	export const backpackAtom = atom<boolean>(false);
	export const emotesMenuAtom = atom<boolean>(false);
	export const healthAtom = atom<boolean>(false);
	export const selfViewAtom = atom<boolean>(false);
}

function updateCoreGuisAtom(): void {
	try {
		const chat = CoreGuis.chatAtom();
		const playerList = CoreGuis.playerListAtom();
		const captures = CoreGuis.capturesAtom();
		const backpack = CoreGuis.backpackAtom();
		const emotesMenu = CoreGuis.emotesMenuAtom();
		const health = CoreGuis.healthAtom();
		const selfView = CoreGuis.selfViewAtom();
		
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, chat);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, playerList);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Captures, captures);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, backpack);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.EmotesMenu, emotesMenu);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, health);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.SelfView, selfView);
	} catch (err) {
		setTimeout(updateCoreGuisAtom, 0.1);
	}
}

effect(updateCoreGuisAtom);
