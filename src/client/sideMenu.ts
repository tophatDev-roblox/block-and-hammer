import { StarterGui } from '@rbxts/services';
import { atom, effect } from '@rbxts/charm';

import { clearTimeout, setTimeout, Timeout } from 'shared/timeout';

export namespace SideMenu {
	export const isOpenAtom = atom<boolean>(false);
}

function setPlayerListEnabled(enabled: boolean): void {
	StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, enabled);
}

effect(() => {
	const sideMenuOpen = SideMenu.isOpenAtom();
	
	let timeout: Timeout;
	
	const updatePlayerList = () => {
		try {
			setPlayerListEnabled(!sideMenuOpen);
		} catch (err) {
			warn(`[client::sideMenu] failed to toggle leaderboard: ${err}`);
			timeout = setTimeout(updatePlayerList, 0.1);
		}
	};
	
	timeout = setTimeout(updatePlayerList, sideMenuOpen ? 0 : 0.6);
	
	return () => clearTimeout(timeout);
});
