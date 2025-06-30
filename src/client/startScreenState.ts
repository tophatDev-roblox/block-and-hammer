import { atom, batch, effect } from '@rbxts/charm';
import { ContentProvider } from '@rbxts/services';

import { setTimeout } from 'shared/timeout';
import { Remotes } from 'shared/remotes';
import { Dictionary } from 'shared/dictionary';
import { Assets } from 'shared/assets';
import { CharacterState } from './character/state';
import { CoreGuis } from './coreGuis';

export namespace StartScreenState {
	export const isVisibleAtom = atom<boolean>(true);
	export const loadingStatusAtom = atom<string>('initializing...');
	export const isLoadingFinished = atom<boolean>(false);
	export const loadingPercentage = atom<number>(0);
}

function fullReset(): void {
	const didReset = Remotes.fullReset();
	if (!didReset) {
		setTimeout(fullReset, 0.1);
	}
};

(async () => {
	const preload = Promise.promisify((...args: Parameters<ContentProvider['PreloadAsync']>) => ContentProvider.PreloadAsync(...args));
	
	StartScreenState.loadingStatusAtom('preloading icons...');
	
	const totalIcons = Dictionary.countKeys(Assets.Icons);
	
	let loadedIcons = 0;
	for (const [icon, id] of pairs(Assets.Icons)) {
		const decal = new Instance('Decal');
		decal.Texture = id;
		
		await preload([decal], (_, status) => {
			if (status === Enum.AssetFetchStatus.Success) {
				StartScreenState.loadingStatusAtom(`'${icon}' preloaded successfully`);
			} else {
				StartScreenState.loadingStatusAtom(`'${icon}' failed to preload with status ${status}`);
			}
			
			loadedIcons++;
			StartScreenState.loadingPercentage(loadedIcons / totalIcons);
		});
	}
	
	batch(() => {
		StartScreenState.loadingStatusAtom('all done!');
		StartScreenState.isLoadingFinished(true);
	});
})();

effect(() => {
	const isVisible = StartScreenState.isVisibleAtom();
	
	CharacterState.disableCameraAtom(isVisible);
	
	batch(() => {
		CoreGuis.chatAtom(!isVisible);
		CoreGuis.playerListAtom(!isVisible);
	});
	
	if (isVisible) {
		Remotes.unloadCharacter.fire();
	} else {
		fullReset();
	}
});
