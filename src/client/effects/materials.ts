import { SoundService } from '@rbxts/services';

export interface ParticleData {
	totalParticles: number;
	colorMultiplier: number;
	duration: number;
}

interface MaterialConfig {
	sound?: {
		instance: Sound;
		startTime: number;
		volume: number;
		speed: number;
		volumeVariation?: number;
		speedVariation?: number;
	};
	getData: () => ParticleData;
	style: (particle: BasePart) => void;
}

const RNG = new Random();

export const materialConfiguration = new Map<Enum.Material, MaterialConfig>();

materialConfiguration.set(Enum.Material.Grass, {
	sound: {
		instance: SoundService.WaitForChild('GrassHit') as Sound,
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
		instance: SoundService.WaitForChild('DirtHit') as Sound,
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
		instance: SoundService.WaitForChild('SandHit') as Sound,
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
		instance: SoundService.WaitForChild('StoneHit') as Sound,
		startTime: 0,
		volume: 0.2,
		speed: 0.9,
		speedVariation: 0.05,
	},
	getData: () => ({ totalParticles: RNG.NextInteger(0, 3), colorMultiplier: 0.8, duration: 3 }),
	style: (particle) => {
		particle.Transparency = 0.3;
		particle.Size = Vector3.one.mul(RNG.NextNumber(0.8, 1));
	},
});

materialConfiguration.set(Enum.Material.Plastic, {
	sound: {
		instance: SoundService.WaitForChild('PlasticHit') as Sound,
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
