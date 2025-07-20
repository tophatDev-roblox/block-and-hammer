import { GuiService } from '@rbxts/services';

import { subscribe } from '@rbxts/charm';
import { setTimeout } from '@rbxts/set-timeout';

import { CoreGuis } from 'client/core-guis';

import { LocationState } from './location-state';

subscribe(LocationState.pathAtom, (path, previousPath) => {
	if (LocationState.isAt('/start-screen', path)) {
		return;
	}
	
	const sideMenuOpen = LocationState.isAt('/game/side-menu', path);
	const wasSideMenuOpen = LocationState.isAt('/game/side-menu', previousPath);
	if (sideMenuOpen === wasSideMenuOpen) {
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
