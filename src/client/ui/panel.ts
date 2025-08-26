import { setTimeout } from '@rbxts/set-timeout';
import { effect } from '@rbxts/charm';

import { CoreGuis } from 'client/core-guis';

import { UI } from 'client/ui/state';

effect(() => {
	const state = UI.stateAtom();
	const view = UI.SideMenu.panelAtom();
	
	const sideMenuOpen = state === UI.State.SideMenu;
	
	if (view !== UI.SideMenu.Panel.None && sideMenuOpen) {
		CoreGuis.chatAtom(false);
	} else {
		return setTimeout(() => {
			CoreGuis.chatAtom(true);
		}, 0.6);
	}
});
