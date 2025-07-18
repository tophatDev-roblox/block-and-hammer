import { GuiService } from '@rbxts/services';

import { atom, effect } from '@rbxts/charm';
import { setTimeout } from '@rbxts/set-timeout';

import { CoreGuis } from 'client/core-guis';

import { StartScreenState } from './start-screen-state';

export namespace SideMenuState {
	export const isOpenAtom = atom<boolean>(false);
}

effect(() => {
	const sideMenuOpen = SideMenuState.isOpenAtom();
	const isInStartScreen = StartScreenState.isVisibleAtom();
	if (isInStartScreen) {
		return;
	}
	
	if (GuiService.IsTenFootInterface()) {
		CoreGuis.playerListAtom(false);
		return;
	}
	
	if (sideMenuOpen) {
		CoreGuis.playerListAtom(false);
	} else {
		if (!GuiService.ReducedMotionEnabled) {
			const clearTimeout = setTimeout(() => {
				CoreGuis.playerListAtom(true);
			}, 0.6);
			
			return () => {
				clearTimeout();
			};
		} else {
			CoreGuis.playerListAtom(true);
		}
	}
});
