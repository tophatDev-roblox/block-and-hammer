import { RunService, SoundService, Workspace } from '@rbxts/services';

import Immut from '@rbxts/immut';

import { atom, subscribe } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';
import { TimeSpan } from 'shared/time-span';

const RNG = new Random();

let windSound: Sound;

(async () => {
	windSound = await waitForChild(SoundService, 'Wind', 'Sound');
})();

export namespace SFX {
	export const subtitlesAtom = atom<ReadonlyArray<[name: string, endTime: number, count: number]>>([]);
	export const windSpeedAtom = atom<number>(0);
	
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
	
	function onHeartbeat(): void {
		subtitlesAtom((subtitles) => Immut.produce(subtitles, (draft) => {
			for (const i of $range(0, draft.size() - 1)) {
				const [, endTime] = draft[i];
				if (endTime < math.huge && TimeSpan.timeUntil(endTime) < 0) {
					Immut.table.remove(draft, i + 1);
					break;
				}
			}
		}));
	}
	
	function addSound(targetSound: Sound, count: boolean, length: number): void {
		const name = SFX.getName(targetSound);
		const debounceDuration = length + 1;
		
		subtitlesAtom((subtitles) => Immut.produce(subtitles, (draft) => {
			const index = draft.findIndex(([sound]) => sound === name);
			if (index !== -1) {
				draft[index][1] = TimeSpan.now() + debounceDuration;
				if (count) {
					draft[index][2]++;
				}
			} else {
				Immut.table.insert(draft, [name, TimeSpan.now() + debounceDuration, 1])
			}
		}));
	}
	
	subscribe(windSpeedAtom, (windSpeed, previousWindSpeed) => {
		windSound.PlaybackSpeed = windSpeed;
		
		const name = SFX.getName(windSound);
		if (windSpeed > 0.5 && previousWindSpeed <= 0.5) {
			subtitlesAtom((subtitles) => Immut.produce(subtitles, (draft) => {
				const index = draft.findIndex(([sound]) => sound === name);
				if (index !== -1) {
					draft[index][1] = math.huge;
				} else {
					Immut.table.insert(draft, [name, math.huge, 1]);
				}
			}));
		} else if (windSpeed <= 0.5 && previousWindSpeed > 0.5) {
			subtitlesAtom((subtitles) => Immut.produce(subtitles, (draft) => {
				const index = draft.findIndex(([sound]) => sound === name);
				if (index === -1) {
					return;
				}
				
				draft[index][1] = TimeSpan.now() + 1;
			}));
		}
	});
	
	RunService.Heartbeat.Connect(onHeartbeat);
}
