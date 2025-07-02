import { Workspace } from '@rbxts/services';

import { TimeSpan } from 'shared/timeSpan';

const RNG = new Random();

export namespace SFX {
	export interface Configuration {
		startTime?: number;
		volume?: number;
		volumeVariation?: number;
		speed?: number;
		speedVariation?: number;
	}
	
	export async function play(targetSound: Sound, configuration: Configuration = {}): Promise<void> {
		const {
			startTime = 0,
			volume = 1,
			volumeVariation = 0,
			speed = 1,
			speedVariation = 0,
		} = configuration;
		
		const sound = targetSound.Clone();
		sound.TimePosition = startTime;
		sound.Volume = volume + RNG.NextNumber(-volumeVariation, volumeVariation);
		sound.PlaybackSpeed = speed + RNG.NextNumber(-speedVariation, speedVariation);
		sound.Parent = Workspace;
		sound.Destroy();
		
		await TimeSpan.sleep(targetSound.TimeLength);
	}
}
