import { GuiService } from '@rbxts/services';

import { subscribe } from '@rbxts/charm';
import { setTimeout } from '@rbxts/set-timeout';

import { CoreGuis } from 'client/core-guis';

import { PathState } from './path-state';

subscribe(PathState.valueAtom, (path, previousPath) => {
	const isInStartScreen = PathState.isAt(PathState.Location.StartScreen, path);
	if (isInStartScreen) {
		return;
	}
	
	const sideMenuOpen = PathState.isAt(PathState.Location.SideMenu, path);
	const wasSideMenuOpen = PathState.isAt(PathState.Location.SideMenu, previousPath);
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
