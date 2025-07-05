import { RunService, SoundService, Workspace } from '@rbxts/services';
import { effect, peek } from '@rbxts/charm';
import { createMotion } from '@rbxts/ripple';

import { TimeSpan } from 'shared/timeSpan';
import { Raycast } from 'shared/raycast';
import { waitForChild } from 'shared/waitForChild';
import { Logger } from 'shared/logger';
import { Character } from 'client/character';
import { CharacterState } from 'client/character/state';
import { InputType } from 'client/inputType';
import { UserSettings } from 'client/userSettings';
import { SFX } from 'client/sfx';
import { materialConfiguration } from './materials';

const logger = new Logger();
const RNG = new Random();

let mapFolder: Folder;
let effectsFolder: Folder;
let hapticsFolder: Folder;
let hammerHitSound: Sound;
let explosionSound: Sound;

let explosionHaptics: HapticEffect;

(async () => {
	mapFolder = await waitForChild(Workspace, 'Map', 'Folder');
	effectsFolder = await waitForChild(Workspace, 'Effects', 'Folder');
	hapticsFolder = await waitForChild(Workspace, 'Haptics', 'Folder');
	hammerHitSound = await waitForChild(SoundService, 'HammerHit', 'Sound');
	explosionSound = await waitForChild(SoundService, 'Explosion', 'Sound');
	
	explosionHaptics = new Instance('HapticEffect');
	explosionHaptics.Type = Enum.HapticEffectType.Custom;
	explosionHaptics.Name = 'CharacterExplosion';
	explosionHaptics.Parent = hapticsFolder;
})();

export namespace Effects {
	export function getPointOn3dCircle(center: Vector3, normal: Vector3, radius: number, theta: number): Vector3 {
		const A = math.abs(normal.X) < 0.1 ? Vector3.xAxis : Vector3.yAxis;
		const U = normal.Cross(A).Unit;
		const V = normal.Cross(U);
		return center.add(U.mul(math.cos(theta)).add(V.mul(math.sin(theta))).mul(radius));
	}
	
	export function createBaseParticle(part: BasePart): BasePart {
		const baseParticle = Instance.fromExisting(part);
		baseParticle.Anchored = false;
		baseParticle.Massless = true;
		baseParticle.CanCollide = true;
		baseParticle.CastShadow = false;
		baseParticle.CollisionGroup = 'Particles';
		
		return baseParticle;
	}
	
	export function makeHitParticles(partMaterial: Enum.Material, baseParticle: BasePart, point: Vector3, normalVector: Vector3, inheritedVelocity: Vector3): void {
		const material = materialConfiguration.get(partMaterial);
		if (material === undefined) {
			logger.warn('unsupported material:', partMaterial);
			return;
		}
		
		const { totalParticles, colorMultiplier, duration } = material.getData();
		
		baseParticle.Color = new Color3(
			baseParticle.Color.R * colorMultiplier,
			baseParticle.Color.G * colorMultiplier,
			baseParticle.Color.B * colorMultiplier,
		);
		
		const particleMotion = createMotion(0, {
			heartbeat: RunService.PreRender,
			start: true,
		});
		
		particleMotion.tween(1, {
			style: Enum.EasingStyle.Linear,
			time: duration,
		});
		
		const particles = new Set<BasePart>();
		for (const i of $range(1, totalParticles)) {
			const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi);
			const spreadDirection = getPointOn3dCircle(normalVector, normalVector.Unit, RNG.NextNumber(0.1, 1), theta);
			
			const particle = Instance.fromExisting(baseParticle);
			material.style(particle);
			particle.CFrame = CFrame.lookAlong(point, RNG.NextUnitVector());
			particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(40, 50)).add(inheritedVelocity);
			particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
			particle.Parent = effectsFolder;
			
			const baseSize = particle.Size;
			
			particleMotion.onStep((alpha) => {
				const inverseAlpha = 1 - alpha;
				particle.Size = baseSize.mul(inverseAlpha);
				particle.LocalTransparencyModifier = alpha;
			});
			
			particles.add(particle);
		}
		
		if (material.sound !== undefined) {
			SFX.play(material.sound.instance, material.sound);
		}
		
		particleMotion.onComplete(() => {
			particleMotion.destroy();
			for (const particle of particles) {
				particle.Destroy();
			}
		});
	}
	
	export function makeSmashParticles(baseParticle: BasePart, magnitude: number, point: Vector3, normalVector: Vector3, inheritedVelocity: Vector3): void {
		const velocityStrength = math.min((magnitude - 140) / 15, 15);
		const totalParticles = RNG.NextInteger(10, 20);
		
		const particleMotion = createMotion(0, {
			heartbeat: RunService.PreRender,
			start: true,
		});
		
		particleMotion.tween(1, {
			style: Enum.EasingStyle.Linear,
			time: 5,
		});
		
		const particles = new Set<BasePart>();
		for (const i of $range(1, totalParticles)) {
			const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi);
			const spreadDirection = getPointOn3dCircle(normalVector, normalVector.Unit, RNG.NextNumber(0.1, 1), theta);
			
			const particle = Instance.fromExisting(baseParticle);
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.6, 1.2));
			particle.CFrame = CFrame.lookAlong(point, RNG.NextUnitVector());
			particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(5, 6) * velocityStrength).add(inheritedVelocity);
			particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
			particle.Parent = effectsFolder;
			
			const baseSize = particle.Size;
			
			particleMotion.onStep((alpha) => {
				const inverseAlpha = 1 - alpha;
				particle.Size = baseSize.mul(inverseAlpha);
				particle.LocalTransparencyModifier = alpha;
			});
			
			particles.add(particle);
		}
		
		particleMotion.onComplete(() => {
			particleMotion.destroy();
			for (const particle of particles) {
				particle.Destroy();
			}
		});
		
		SFX.play(hammerHitSound, {
			startTime: 0.1,
			speedVariation: 0.05,
		});
	}
}

effect(() => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	let previousBodyVelocity = characterParts.body.AssemblyLinearVelocity;
	let hammerVelocity = Vector3.zero;
	let lastEffectTime = -1;
	
	const touchedEvent = characterParts.hammer.head.Touched.Connect((otherPart) => {
		if (TimeSpan.timeSince(lastEffectTime) < 0.1) {
			return;
		}
		
		let magnitude = hammerVelocity.sub(otherPart.AssemblyLinearVelocity).sub(characterParts.body.AssemblyLinearVelocity.div(4)).Magnitude;
		magnitude *= 1.5;
		if (magnitude < 50) {
			return;
		}
		
		const otherPoint = otherPart.GetClosestPointOnSurface(characterParts.hammer.head.Position);
		const directionToPart = otherPoint.sub(characterParts.hammer.head.Position);
		
		const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder]);
		const origin = characterParts.hammer.head.Position.sub(directionToPart);
		const direction = directionToPart.mul(3);
		
		const result = Workspace.Raycast(origin, direction, params);
		
		if (result === undefined) {
			return;
		}
		
		const targetPart = result.Instance;
		const point = targetPart.GetClosestPointOnSurface(characterParts.hammer.head.Position);
		const inheritedVelocity = hammerVelocity.mul(-0.2);
		
		const baseParticle = Effects.createBaseParticle(targetPart);
		const normalVector = result.Normal.Unit;
		if (magnitude > 165) {
			Effects.makeSmashParticles(baseParticle, magnitude, point, normalVector, inheritedVelocity)
		} else if (magnitude > 50) {
			Effects.makeHitParticles(otherPart.Material, baseParticle, point, normalVector, inheritedVelocity);
		}
		
		baseParticle.Destroy();
		lastEffectTime = TimeSpan.now();
	});
	
	const preSimulationEvent = RunService.PreSimulation.Connect(() => {
		hammerVelocity = characterParts.hammer.head.AssemblyLinearVelocity;
		// i just copied the hit detection from the original block and hammer,
		// not sure why this works so much better than getting AssemblyLinearVelocity directly
		
		const bodyVelocity = characterParts.body.AssemblyLinearVelocity;
		if (characterParts.model.GetAttribute('justReset')) {
			previousBodyVelocity = bodyVelocity;
			characterParts.model.SetAttribute('justReset', undefined);
		}
		
		SFX.windSpeedAtom(math.clamp((bodyVelocity.Magnitude - 50) / 150, 0, 2));
		
		const impactMagnitude = math.abs(bodyVelocity.Magnitude - previousBodyVelocity.Magnitude);
		if (impactMagnitude > 130) {
			let effectIntensity = math.clamp(1 + (impactMagnitude - 160) / 10, 1, 3);
			
			SFX.play(explosionSound);
			
			const explosion = new Instance('Explosion');
			explosion.Position = characterParts.body.Position;
			explosion.BlastPressure = 0;
			explosion.BlastRadius = 0;
			explosion.ExplosionType = Enum.ExplosionType.NoCraters;
			explosion.Parent = effectsFolder;
			
			const rayDistance = 50;
			
			const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder]);
			const direction = previousBodyVelocity.sub(bodyVelocity).Unit.mul(rayDistance);
			const origin = characterParts.body.Position.sub(direction.Unit.mul(5));
			
			const result = Workspace.Raycast(origin, direction, params);
			if (result !== undefined) {
				const totalParticles = RNG.NextInteger(20, 25);
				const normalVector = result.Normal;
				
				const baseParticle = Instance.fromExisting(result.Instance);
				baseParticle.Anchored = false;
				baseParticle.Massless = true;
				baseParticle.CanCollide = true;
				baseParticle.CastShadow = false;
				baseParticle.CollisionGroup = 'Particles';
				
				const particleMotion = createMotion(0, {
					heartbeat: RunService.PreRender,
					start: true,
				});
				
				particleMotion.tween(1, {
					style: Enum.EasingStyle.Linear,
					time: 5,
				});
				
				const particles = new Set<BasePart>();
				for (const i of $range(1, totalParticles)) {
					const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi);
					const spreadDirection = Effects.getPointOn3dCircle(normalVector, normalVector.Unit, RNG.NextNumber(0.3, 2), theta);
					
					const particle = Instance.fromExisting(baseParticle);
					particle.Size = Vector3.one.mul(RNG.NextNumber(1.5, 3));
					particle.CFrame = CFrame.lookAlong(result.Position, RNG.NextUnitVector());
					particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(60, 80));
					particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
					particle.Parent = effectsFolder;
					
					const baseSize = particle.Size;
					
					particleMotion.onStep((alpha) => {
						const inverseAlpha = 1 - alpha;
						particle.Size = baseSize.mul(inverseAlpha);
						particle.LocalTransparencyModifier = alpha;
					});
					
					particles.add(particle);
				}
				
				baseParticle.Destroy();
				
				particleMotion.onComplete(() => {
					particleMotion.destroy();
					for (const particle of particles) {
						particle.Destroy();
					}
				});
				
				if (impactMagnitude > 450) {
					effectIntensity = math.clamp(1 + (impactMagnitude - 160) / 10, 1, 5);
					
					const radius = 10 * math.log((impactMagnitude - 300) / 10, 2);
					const totalParts = math.floor(radius / 2);
					const randomAngleOffset = math.rad(5);
					
					const blockMotion = createMotion(0, {
						heartbeat: RunService.PreRender,
						start: true,
					});
					
					blockMotion.tween(1, {
						style: Enum.EasingStyle.Linear,
						time: 20,
					});
					
					const blocks = new Set<BasePart>();
					for (const i of $range(1, totalParts)) {
						const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi) + RNG.NextNumber(-randomAngleOffset, randomAngleOffset);
						const point = Effects.getPointOn3dCircle(result.Position, result.Normal, radius, theta);
						
						const origin = point.add(result.Normal.mul(5));
						const direction = result.Normal.mul(-rayDistance);
						
						const subResult = Workspace.Raycast(origin, direction, params);
						
						if (subResult === undefined) {
							continue;
						}
						
						const block = Instance.fromExisting(subResult.Instance);
						block.Anchored = true;
						block.Massless = true;
						block.CanCollide = true;
						block.CollisionGroup = 'Particles';
						block.CFrame = CFrame.lookAlong(subResult.Position, RNG.NextUnitVector());
						block.Size = Vector3.one.mul(RNG.NextNumber(12, 15));
						block.Parent = effectsFolder;
						
						blockMotion.onStep((alpha) => {
							block.Position = subResult.Position.add(subResult.Normal.mul(-block.Size.Y * alpha));
							block.LocalTransparencyModifier = alpha;
						});
						
						blocks.add(block);
					}
					
					blockMotion.onComplete(() => {
						blockMotion.destroy();
						for (const block of blocks) {
							block.Destroy();
						}
					});
				}
				
				Character.ragdoll(effectIntensity);
				Character.shake(effectIntensity);
				
				const userSettings = peek(UserSettings.stateAtom);
				const inputType = peek(InputType.stateAtom)
				if (!userSettings.disableHaptics && inputType === InputType.Value.Controller) {
					const baseAmplitude = effectIntensity / 4 + 0.2;
					const duration = 700;
					const steps = 10;
					
					const waveformKeys = new Array<FloatCurveKey>();
					for (const i of $range(1, steps)) {
						waveformKeys.push(new FloatCurveKey(
							math.map(i, 1, steps, 0, duration),
							math.clamp(baseAmplitude * (1 - (i - 1) / (steps - 1)) ** 1.5, 0.1, 1),
							Enum.KeyInterpolationMode.Cubic,
						));
					}
					
					explosionHaptics.SetWaveformKeys(waveformKeys);
					explosionHaptics.Play();
				}
			}
		}
		
		previousBodyVelocity = bodyVelocity;
	});
	
	return () => {
		touchedEvent.Disconnect();
		preSimulationEvent.Disconnect();
	};
});
