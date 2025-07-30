import { GuiService } from '@rbxts/services';

import { setTimeout } from '@rbxts/set-timeout';
import { subscribe } from '@rbxts/charm';

import { CoreGuis } from 'client/core-guis';

import { LocationState } from './location-state';

subscribe(LocationState.pathAtom, (path, previousPath) => {
	if (LocationState.isAt('/start-screen', path)) {
		return;
	}
	
	const panel = LocationState.match('/game/side-menu/:panel', path)?.get('panel');
	const previousPanel = LocationState.match('/game/side-menu/:panel', previousPath)?.get('panel');
	if (panel === previousPanel) {
		return;
	}
	
	if (panel !== undefined) {
		CoreGuis.chatAtom(false);
	} else {
		if (!GuiService.ReducedMotionEnabled) {
			const clearTimeout = setTimeout(() => {
				CoreGuis.chatAtom(true);
			}, 0.6);
			
			return clearTimeout;
		} else {
			CoreGuis.chatAtom(true);
		}
	}
});
