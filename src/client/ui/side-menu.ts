import { setTimeout } from '@rbxts/set-timeout';
import { effect } from '@rbxts/charm';

import { CoreGuis } from 'client/core-guis';

import { UI } from 'client/ui/state';

effect(() => {
	const state = UI.stateAtom();
	
	if (state === UI.State.StartScreen) {
		return;
	}
	
	const sideMenuOpen = state === UI.State.SideMenu;
	
	if (sideMenuOpen) {
		CoreGuis.playerListAtom(false);
		
		UI.SideMenu.panelAtom(UI.SideMenu.Panel.None);
		UI.SideMenu.isClosingPanelAtom(false);
	} else {
		return setTimeout(() => {
			CoreGuis.playerListAtom(true);
		}, 0.6);
	}
});
