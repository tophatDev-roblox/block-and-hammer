import { atom, effect } from '@rbxts/charm';

import { StartScreenState } from './startScreenState';
import { CoreGuis } from './coreGuis';
import { clearTimeout, setTimeout } from 'shared/timeout';

export namespace SideMenuState {
	export const isOpenAtom = atom<boolean>(false);
}

effect(() => {
	const sideMenuOpen = SideMenuState.isOpenAtom();
	const isInStartScreen = StartScreenState.isVisibleAtom();
	if (isInStartScreen) {
		return;
	}
	
	if (sideMenuOpen) {
		CoreGuis.playerListAtom(false);
	} else {
		const timeout = setTimeout(() => {
			CoreGuis.playerListAtom(true);
		}, 0.6);
		
		return () => {
			clearTimeout(timeout);
		};
	}
});
