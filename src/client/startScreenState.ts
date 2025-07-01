import { ContentProvider, RunService } from '@rbxts/services';
import { setTimeout } from '@rbxts/set-timeout';
import { atom, batch, effect } from '@rbxts/charm';

import { Remotes } from 'shared/remotes';
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

(() => {
	const preload = Promise.promisify((...args: Parameters<ContentProvider['PreloadAsync']>) => ContentProvider.PreloadAsync(...args));
	
	StartScreenState.loadingStatusAtom('preloading asset ids...');
	
	const contentList = new Array<Instance | string>();
	
	const allImages = { ...Assets.Icons, ...Assets.Images };
	for (const [name, id] of pairs(allImages)) {
		const decal = new Instance('Decal');
		decal.Name = name;
		decal.Texture = id;
		contentList.push(decal);
	}
	
	const allSounds = { ...Assets.SFX, ...Assets.Music };
	for (const [name, id] of pairs(allSounds)) {
		const sound = new Instance('Sound');
		sound.Name = name;
		sound.SoundId = id;
		contentList.push(sound);
	}
	
	let loadedAssets = 0;
	preload(contentList, (id, status) => {
		if (status === Enum.AssetFetchStatus.Success) {
			StartScreenState.loadingStatusAtom(`${id} preloaded successfully`);
		} else {
			StartScreenState.loadingStatusAtom(`${id} failed to preload (${status})`);
		}
		
		loadedAssets++;
		StartScreenState.loadingPercentage(loadedAssets / contentList.size());
	});
	
	const connection = RunService.Heartbeat.Connect(() => {
		if (loadedAssets < contentList.size()) {
			return;
		}
		
		connection.Disconnect();
		batch(() => {
			StartScreenState.loadingStatusAtom('all done!');
			StartScreenState.isLoadingFinished(true);
		});
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
