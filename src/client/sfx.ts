import { SoundService, Workspace } from '@rbxts/services';
import { debounce, Debounced } from '@rbxts/set-timeout';
import { atom, subscribe } from '@rbxts/charm';

import { TimeSpan } from 'shared/timeSpan';
import { waitForChild } from 'shared/waitForChild';

const RNG = new Random();

let windSound: Sound;

(async () => {
	windSound = await waitForChild(SoundService, 'Wind', 'Sound');
})();

export namespace SFX {
	export const playingSoundsAtom = atom<Array<[name: string, endTime: number, count: number]>>([]);
	export const windSpeedAtom = atom<number>(0);
	
	const soundDebounces = new Map<Sound, Debounced<() => void>>();
	
	subscribe(windSpeedAtom, (windSpeed, previousWindSpeed) => {
		windSound.PlaybackSpeed = windSpeed;
		
		const name = SFX.getName(windSound);
		if (windSpeed > 0.5 && previousWindSpeed <= 0.5) {
			playingSoundsAtom((playingSounds) => {
				const updatedSounds = table.clone(playingSounds);
				
				const index = playingSounds.findIndex(([sound]) => sound === name);
				if (index !== -1) {
					updatedSounds[index][1] = math.huge;
				} else {
					updatedSounds.push([name, math.huge, 1]);
				}
				
				return updatedSounds;
			});
		} else if (windSpeed <= 0.5 && previousWindSpeed > 0.5) {
			playingSoundsAtom((playingSounds) => {
				const index = playingSounds.findIndex(([sound]) => sound === name);
				if (index === -1) {
					return playingSounds;
				}
				
				const updatedSounds = table.clone(playingSounds);
				updatedSounds[index][1] = TimeSpan.now() + 1;
				return updatedSounds;
			});
		}
	});
	
	export interface Configuration {
		startTime?: number;
		volume?: number;
		volumeVariation?: number;
		speed?: number;
		speedVariation?: number;
	}
	
	export function getName(sound: Sound): string {
		return sound.GetAttribute('displayName') as string ?? sound.GetFullName();
	}
	
	function addSound(targetSound: Sound, count: boolean, length: number): void {
		const name = SFX.getName(targetSound);
		const debounceDuration = length + 1;
		
		playingSoundsAtom((playingSounds) => {
			const removeSoundDebounced = debounce(() => {
				soundDebounces.delete(targetSound);
				
				playingSoundsAtom((playingSounds) => {
					const index = playingSounds.findIndex(([sound]) => sound === name);
					if (index === -1) {
						return playingSounds;
					}
					
					const updatedSounds = table.clone(playingSounds);
					updatedSounds.remove(index);
					return updatedSounds;
				});
			}, debounceDuration);
			
			const updatedSounds = table.clone(playingSounds);
			
			const existingDebounced = soundDebounces.get(targetSound);
			if (existingDebounced !== undefined) {
				existingDebounced();
				
				const index = updatedSounds.findIndex(([sound]) => sound === name);
				if (index !== -1) {
					updatedSounds[index][1] = TimeSpan.now() + debounceDuration;
					if (count) {
						updatedSounds[index][2]++;
					}
				}
			} else {
				soundDebounces.set(targetSound, removeSoundDebounced);
				removeSoundDebounced();
				
				updatedSounds.push([name, TimeSpan.now() + debounceDuration, 1]);
			}
			
			return updatedSounds;
		});
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
		
		addSound(targetSound, true, targetSound.TimeLength);
		
		await TimeSpan.sleep(targetSound.TimeLength);
	}
}
