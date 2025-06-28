import { StarterGui } from '@rbxts/services';
import { atom, effect } from '@rbxts/charm';

export namespace SideMenu {
	export const isOpenAtom = atom<boolean>(false);
}

effect(() => {
	const sideMenuOpen = SideMenu.isOpenAtom();
	
	const thread = task.delay(sideMenuOpen ? 0 : 0.6, () => {
		while (true) {
			try {
				StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, !sideMenuOpen);
				break;
			} catch (err) {
				warn(`[client::sideMenu] failed to toggle leaderboard: ${err}`);
				task.wait(0.1);
			}
		}
	});
	
	return () => {
		task.cancel(thread);
	};
});
