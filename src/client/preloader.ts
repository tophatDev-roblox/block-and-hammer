import { ContentProvider, RunService } from '@rbxts/services';
import { Atom, batch } from '@rbxts/charm';

import { Assets } from 'shared/assets';

export namespace Preloader {
	export async function preloadAtom(loadingStatusAtom: Atom<string>, loadingPercentageAtom: Atom<number>, isLoadingFinishedAtom: Atom<boolean>): Promise<void> {
		const preload = Promise.promisify((...args: Parameters<ContentProvider['PreloadAsync']>) => ContentProvider.PreloadAsync(...args));
		
		loadingStatusAtom('preloading asset ids...');
		
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
				loadingStatusAtom(`${id} preloaded successfully`);
			} else {
				loadingStatusAtom(`${id} failed to preload (${status})`);
			}
			
			loadedAssets++;
			loadingPercentageAtom(loadedAssets / contentList.size());
		});
		
		return new Promise<void>((resolve) => {
			const connection = RunService.Heartbeat.Connect(() => {
				if (loadedAssets < contentList.size()) {
					return;
				}
				
				connection.Disconnect();
				batch(() => {
					loadingStatusAtom('all done!');
					isLoadingFinishedAtom(true);
				});
				
				resolve();
			});
		});
	}
}
