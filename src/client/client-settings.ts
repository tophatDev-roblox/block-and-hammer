import { atom, subscribe } from '@rbxts/charm';
import { debounce } from '@rbxts/set-timeout';

import { UserSettings } from 'shared/user-settings';
import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

const logger = new Logger('client-settings');

Remotes.loadSettings.connect((userSettings) => {
	logger.print('loading settings:', userSettings);
	
	ClientSettings.stateAtom(userSettings);
});

const onSettingsUpdate = debounce((userSettings: UserSettings.Value) => {
	logger.print('saving settings:', userSettings);
	
	Remotes.updateSettings.fire(userSettings);
}, 2);

export namespace ClientSettings {
	export const stateAtom = atom<UserSettings.Value>(UserSettings.defaultValue);
	
	subscribe(stateAtom, onSettingsUpdate);
}
