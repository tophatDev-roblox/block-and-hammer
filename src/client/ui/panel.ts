import { GuiService } from '@rbxts/services';

import { setTimeout } from '@rbxts/set-timeout';
import { effect } from '@rbxts/charm';

import { CoreGuis } from 'client/core-guis';

import { UI } from 'client/ui/state';

effect(() => {
	const view = UI.SideMenu.panelAtom();
	
	if (view !== UI.SideMenu.Panel.None) {
		CoreGuis.chatAtom(false);
	} else {
		if (!GuiService.ReducedMotionEnabled) {
			return setTimeout(() => {
				CoreGuis.chatAtom(true);
			}, 0.6);
		} else {
			CoreGuis.chatAtom(true);
		}
	}
});
