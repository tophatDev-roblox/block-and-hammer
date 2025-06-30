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
	
	StartScreenState.loadingStatusAtom('preloading asset ids...');
	
	const allAssets = { ...Assets.Icons, ...Assets.Images };
	
	const totalAssets = Dictionary.countKeys(allAssets);
	let loadedAssets = 0;
	for (const [name, id] of pairs(allAssets)) {
		const decal = new Instance('Decal');
		decal.Texture = id;
		
		await preload([decal], (_, status) => {
			if (status === Enum.AssetFetchStatus.Success) {
				StartScreenState.loadingStatusAtom(`'${name}' preloaded successfully`);
			} else {
				StartScreenState.loadingStatusAtom(`'${name}' failed to preload with status ${status}`);
			}
			
			loadedAssets++;
			StartScreenState.loadingPercentage(loadedAssets / totalAssets);
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
