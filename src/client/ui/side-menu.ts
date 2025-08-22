import { GuiService } from '@rbxts/services';

import { effect } from '@rbxts/charm';
import { setTimeout } from '@rbxts/set-timeout';

import { CoreGuis } from 'client/core-guis';

import { UI } from 'client/ui/state';

effect(() => {
	const state = UI.stateAtom();
	if (state === UI.State.StartScreen) {
		return;
	}
	
	const sideMenuOpen = state === UI.State.SideMenu;
	
	if (GuiService.IsTenFootInterface()) {
		CoreGuis.playerListAtom(false);
		return;
	}
	
	if (sideMenuOpen) {
		CoreGuis.playerListAtom(false);
		
		UI.SideMenu.panelAtom(UI.SideMenu.Panel.None);
		UI.SideMenu.isClosingPanelAtom(false);
	} else {
		if (!GuiService.ReducedMotionEnabled) {
			return setTimeout(() => {
				CoreGuis.playerListAtom(true);
			}, 0.6);
		} else {
			CoreGuis.playerListAtom(true);
		}
	}
});
