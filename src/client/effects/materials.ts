import { SoundService } from '@rbxts/services';

import { waitForChild } from 'shared/wait-for-child';

import { SFX } from 'client/sfx';

const materialConfiguration = new Map<Enum.Material, Materials.Configuration>();
const RNG = new Random();

(async () => {
	materialConfiguration.set(Enum.Material.Grass, {
		sound: {
			instance: await waitForChild(SoundService, 'GrassHit', 'Sound'),
			startTime: 0.05,
			volume: 0.4,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(3, 6), colorMultiplier: 0.6, duration: 3 }),
		style: (particle) => {
			particle.Transparency = 0.75;
			particle.Size = new Vector3(0.5, RNG.NextNumber(1, 3), 0.5);
		},
	});
	
	materialConfiguration.set(Enum.Material.Ground, {
		sound: {
			instance: await waitForChild(SoundService, 'DirtHit', 'Sound'),
			startTime: 0,
			volume: 0.3,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(8, 14), colorMultiplier: 1.1, duration: 1.5 }),
		style: (particle) => {
			particle.Transparency = 0.5;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
		},
	});
	
	materialConfiguration.set(Enum.Material.Sand, {
		sound: {
			instance: await waitForChild(SoundService, 'SandHit', 'Sound'),
			startTime: 0,
			volume: 0.3,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(8, 14), colorMultiplier: 1.1, duration: 1.5 }),
		style: (particle) => {
			particle.Transparency = 0.5;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
		},
	});
	
	materialConfiguration.set(Enum.Material.Limestone, {
		sound: {
			instance: await waitForChild(SoundService, 'StoneHit', 'Sound'),
			startTime: 0,
			volume: 0.2,
			speed: 0.9,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(2, 4), colorMultiplier: 0.8, duration: 3 }),
		style: (particle) => {
			particle.Transparency = 0.3;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.8, 1));
			if (particle.IsA('Part')) {
				particle.Shape = Enum.PartType.Wedge;
			}
		},
	});
	
	materialConfiguration.set(Enum.Material.Plastic, {
		sound: {
			instance: await waitForChild(SoundService, 'PlasticHit', 'Sound'),
			startTime: 0,
			volume: 0.3,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(3, 6), colorMultiplier: 1.1, duration: 1.5 }),
		style: (particle) => {
			particle.Transparency = 0.5;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
		},
	});
	
	materialConfiguration.set(Enum.Material.WoodPlanks, {
		sound: {
			instance: await waitForChild(SoundService, 'WoodHit', 'Sound'),
			startTime: 0,
			volume: 0.3,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(2, 6), colorMultiplier: 1.1, duration: 1.5 }),
		style: (particle) => {
			particle.Transparency = 0.3;
			particle.Size = new Vector3(RNG.NextNumber(1, 4), 0.2, RNG.NextNumber(0.8, 1.2));
		},
	});
	
	materialConfiguration.set(Enum.Material.Fabric, {
		sound: {
			instance: await waitForChild(SoundService, 'FabricHit', 'Sound'),
			startTime: 0,
			volume: 0.3,
			speed: 1,
			speedVariation: 0.05,
		},
		getData: () => ({ totalParticles: RNG.NextInteger(1, 3), colorMultiplier: 1, duration: 1 }),
		style: (particle) => {
			particle.Transparency = 0.15;
			particle.Size = new Vector3(0.3, RNG.NextNumber(0.5, 2), 0.3);
		},
	});
})();

export namespace Materials {
	export interface ParticleData {
		totalParticles: number;
		colorMultiplier: number;
		duration: number;
	}
	
	export interface Configuration {
		sound?: SFX.Configuration & {
			instance: Sound;
		};
		getData: () => ParticleData;
		style: (particle: BasePart) => void;
	}
	
	export function get(material: Enum.Material): Configuration | undefined {
		return materialConfiguration.get(material);
	}
}
