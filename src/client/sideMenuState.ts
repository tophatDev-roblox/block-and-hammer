import { atom, effect } from '@rbxts/charm';

import { StartScreenState } from './startScreenState';
import { CoreGuis } from './coreGuis';

export namespace SideMenuState {
	export const isOpenAtom = atom<boolean>(false);
}

effect(() => {
	const sideMenuOpen = SideMenuState.isOpenAtom();
	const isInStartScreen = StartScreenState.isVisibleAtom();
	if (isInStartScreen) {
		return;
	}
	
	CoreGuis.playerListAtom(!sideMenuOpen);
});
