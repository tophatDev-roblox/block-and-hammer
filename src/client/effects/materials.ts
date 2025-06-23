export interface ParticleData {
	totalParticles: number;
	colorMultiplier: number;
	duration: number;
}

interface MaterialConfig {
	getData: () => ParticleData;
	style: (particle: BasePart) => void;
}

const RNG = new Random();

export const materialConfiguration = new Map<Enum.Material, MaterialConfig>();

materialConfiguration.set(Enum.Material.Grass, {
	getData: () => ({ totalParticles: RNG.NextInteger(3, 6), colorMultiplier: 0.6, duration: 3 }),
	style: (particle) => {
		particle.Transparency = 0.75;
		particle.Size = new Vector3(0.5, RNG.NextNumber(1, 3), 0.5);
	},
});

materialConfiguration.set(Enum.Material.Ground, {
	getData: () => ({ totalParticles: RNG.NextInteger(8, 14), colorMultiplier: 1.1, duration: 1 }),
	style: (particle) => {
		particle.Transparency = 0.5;
		particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
	},
});

materialConfiguration.set(Enum.Material.Sand, {
	getData: () => ({ totalParticles: RNG.NextInteger(8, 14), colorMultiplier: 1.1, duration: 1 }),
	style: (particle) => {
		particle.Transparency = 0.5;
		particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
	},
});

materialConfiguration.set(Enum.Material.Limestone, {
	getData: () => ({ totalParticles: RNG.NextInteger(0, 3), colorMultiplier: 0.8, duration: 3 }),
	style: (particle) => {
		particle.Transparency = 0.3;
		particle.Size = Vector3.one.mul(RNG.NextNumber(0.8, 1));
	},
});

materialConfiguration.set(Enum.Material.Plastic, {
	getData: () => ({ totalParticles: RNG.NextInteger(3, 6), colorMultiplier: 1.1, duration: 1 }),
	style: (particle) => {
		particle.Transparency = 0.5;
		particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
	},
});
