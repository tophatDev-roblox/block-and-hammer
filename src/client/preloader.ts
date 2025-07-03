import { ContentProvider, Players, RunService } from '@rbxts/services';
import { Atom, batch } from '@rbxts/charm';

import { waitForChild } from 'shared/waitForChild';
import { TimeSpan } from 'shared/timeSpan';
import { Assets } from 'shared/assets';

const client = Players.LocalPlayer;

export namespace Preloader {
	export async function preloadAtom(loadingStatusAtom: Atom<string>, loadingPercentageAtom: Atom<number>, isLoadingFinishedAtom: Atom<boolean>): Promise<void> {
		const playerGui = await waitForChild(client, 'PlayerGui', 'PlayerGui');
		
		const initialLoadingGui = await waitForChild(playerGui, 'InitialLoadingGUI', 'ScreenGui');
		initialLoadingGui.Destroy();
		
		const preload = Promise.promisify((...args: Parameters<ContentProvider['PreloadAsync']>) => ContentProvider.PreloadAsync(...args));
		
		const startTime = TimeSpan.now();
		
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
		
		for (const [name, id] of pairs(Assets.Fonts)) {
			const textLabel = new Instance('TextLabel');
			textLabel.Name = name;
			textLabel.FontFace = new Font(id);
			contentList.push(textLabel);
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
				if (loadedAssets < contentList.size() && TimeSpan.timeSince(startTime) < 4) {
					return;
				}
				
				connection.Disconnect();
				batch(() => {
					loadingPercentageAtom(1);
					loadingStatusAtom('all done!');
					isLoadingFinishedAtom(true);
				});
				
				resolve();
			});
		});
	}
}
