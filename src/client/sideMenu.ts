import { StarterGui } from '@rbxts/services';
import { atom, effect } from '@rbxts/charm';

export const sideMenuOpenedAtom = atom<boolean>(false);

effect(() => {
	const sideMenuOpened = sideMenuOpenedAtom();
	
	const thread = task.delay(sideMenuOpened ? 0 : 0.3, () => {
		while (true) {
			try {
				StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, !sideMenuOpened);
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
