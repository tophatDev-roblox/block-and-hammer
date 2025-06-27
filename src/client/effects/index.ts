import { RunService, SoundService, TweenService, Workspace } from '@rbxts/services';
import { effect, peek } from '@rbxts/charm';

import TimeSpan from 'shared/timeSpan';
import Raycast from 'shared/raycast';
import { shake, ragdoll } from 'client/character';
import { characterAtom } from 'client/character/atoms';
import { materialConfiguration } from './materials';
import { userSettingsAtom } from 'client/settings';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects') as Folder;
const hapticsFolder = Workspace.WaitForChild('Haptics') as Folder;
const hammerHitSound = SoundService.WaitForChild('HammerHit') as Sound;
const explosionSound = SoundService.WaitForChild('Explosion') as Sound;

const RNG = new Random();

const explosionHaptics = new Instance('HapticEffect');
explosionHaptics.Type = Enum.HapticEffectType.GameplayExplosion;
explosionHaptics.Name = 'CharacterExplosion';
explosionHaptics.Parent = hapticsFolder;

function getPointOn3dCircle(center: Vector3, normal: Vector3, radius: number, theta: number): Vector3 {
	const A = math.abs(normal.X) < 0.1 ? Vector3.xAxis : Vector3.yAxis;
	const U = normal.Cross(A).Unit;
	const V = normal.Cross(U);
	return center.add(U.mul(math.cos(theta)).add(V.mul(math.sin(theta))).mul(radius));
}

effect(() => {
	const character = characterAtom();
	if (character === undefined) {
		return;
	}
	
	let previousBodyVelocity = character.body.AssemblyLinearVelocity;
	let hammerVelocity = Vector3.zero;
	let lastEffectTime = -1;
	
	const touchedEvent = character.hammer.head.Touched.Connect((otherPart) => {
		if (TimeSpan.timeSince(lastEffectTime) < 0.1) {
			return;
		}
		
		let magnitude = hammerVelocity.sub(otherPart.AssemblyLinearVelocity).sub(character.body.AssemblyLinearVelocity.div(4)).Magnitude;
		magnitude *= 1.5;
		if (magnitude < 50) {
			return;
		}
		
		const otherPoint = otherPart.GetClosestPointOnSurface(character.hammer.head.Position);
		const directionToPart = otherPoint.sub(character.hammer.head.Position);
		
		const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder]);
		const origin = character.hammer.head.Position.sub(directionToPart);
		const direction = directionToPart.mul(3);
		
		const result = Workspace.Raycast(origin, direction, params);
		
		if (result === undefined) {
			return;
		}
		
		const targetPart = result.Instance;
		const point = targetPart.GetClosestPointOnSurface(character.hammer.head.Position);
		const inheritedVelocity = hammerVelocity.mul(-0.2);
		
		const baseParticle = Instance.fromExisting(targetPart);
		baseParticle.Anchored = false;
		baseParticle.Massless = true;
		baseParticle.CanCollide = true;
		baseParticle.CastShadow = false;
		baseParticle.CollisionGroup = 'Particles';
		
		const tweenProperties: Partial<ExtractMembers<BasePart, Tweenable>> = {
			Size: Vector3.zero,
			LocalTransparencyModifier: 1,
		};
		
		const normalVector = result.Normal.Unit;
		if (magnitude > 165) {
			const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear);
			
			const velocityStrength = math.min((magnitude - 140) / 15, 15);
			const totalParticles = RNG.NextInteger(10, 20);
			
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
				
				const tween = TweenService.Create(particle, tweenInfo, tweenProperties);
				tween.Play();
				
				particles.add(particle);
			}
			
			task.delay(tweenInfo.Time, () => {
				for (const particle of particles) {
					particle.Destroy();
				}
			});
			
			const sound = hammerHitSound.Clone();
			sound.TimePosition = 0.1;
			sound.PlaybackSpeed = RNG.NextNumber(0.95, 1.05);
			sound.Parent = Workspace;
			sound.Destroy();
		} else if (magnitude > 50) {
			const material = materialConfiguration.get(otherPart.Material);
			if (material === undefined) {
				print(`[client::effects] unsupported material: ${otherPart.Material}`);
				return;
			}
			
			const { totalParticles, colorMultiplier, duration } = material.getData();
			const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Linear);
			
			baseParticle.Color = new Color3(
				baseParticle.Color.R * colorMultiplier,
				baseParticle.Color.G * colorMultiplier,
				baseParticle.Color.B * colorMultiplier,
			);
			
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
				
				const tween = TweenService.Create(particle, tweenInfo, tweenProperties);
				tween.Play();
				
				particles.add(particle);
			}
			
			if (material.sound !== undefined) {
				const configuration = material.sound;
				
				const sound = configuration.instance.Clone();
				sound.TimePosition = configuration.startTime;
				sound.Volume = configuration.volume;
				sound.PlaybackSpeed = configuration.speed;
				
				if (configuration.volumeVariation !== undefined) {
					sound.Volume += RNG.NextNumber(-configuration.volumeVariation, configuration.volumeVariation);
				}
				
				if (configuration.speedVariation !== undefined) {
					sound.PlaybackSpeed += RNG.NextNumber(-configuration.speedVariation, configuration.speedVariation);
				}
				
				sound.Parent = Workspace;
				sound.Destroy();
			}
			
			task.delay(duration, () => {
				for (const particle of particles) {
					particle.Destroy();
				}
			});
		}
		
		baseParticle.Destroy();
		lastEffectTime = TimeSpan.now();
	});
	
	const steppedEvent = RunService.Stepped.Connect(() => {
		hammerVelocity = character.hammer.head.AssemblyLinearVelocity;
		// i just copied the hit detection from the original block and hammer,
		// not sure why this works so much better than getting AssemblyLinearVelocity directly
		
		const bodyVelocity = character.body.AssemblyLinearVelocity;
		if (character.model.GetAttribute('justReset')) {
			previousBodyVelocity = bodyVelocity;
			character.model.SetAttribute('justReset', undefined);
		}
		
		const impactMagnitude = math.abs(bodyVelocity.Magnitude - previousBodyVelocity.Magnitude);
		if (impactMagnitude > 130) {
			let effectIntensity = math.clamp(1 + (impactMagnitude - 160) / 10, 1, 3);
			
			const userSettings = peek(userSettingsAtom);
			if (!userSettings.disableHaptics) {
				explosionHaptics.Play();
				task.delay(1, () => {
					explosionHaptics.Stop();
				});
			}
			
			const sound = explosionSound.Clone() as Sound;
			sound.PlaybackSpeed = RNG.NextNumber(0.97, 1.03);
			sound.Parent = Workspace;
			sound.Destroy();
			
			const explosion = new Instance('Explosion');
			explosion.Position = character.body.Position;
			explosion.BlastPressure = 0;
			explosion.BlastRadius = 0;
			explosion.ExplosionType = Enum.ExplosionType.NoCraters;
			explosion.Parent = effectsFolder;
			
			const rayDistance = 50;
			
			const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder]);
			const direction = previousBodyVelocity.sub(bodyVelocity).Unit.mul(rayDistance);
			const origin = character.body.Position.sub(direction.Unit.mul(5));
			
			const result = Workspace.Raycast(origin, direction, params);
			if (result !== undefined) {
				const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear);
				const tweenProperties: Partial<ExtractMembers<BasePart, Tweenable>> = {
					Size: Vector3.one.mul(2),
					LocalTransparencyModifier: 0.5,
				};
				
				const totalParticles = RNG.NextInteger(20, 25);
				const normalVector = result.Normal;
				
				const baseParticle = Instance.fromExisting(result.Instance);
				baseParticle.Anchored = false;
				baseParticle.Massless = true;
				baseParticle.CanCollide = true;
				baseParticle.CastShadow = false;
				baseParticle.CollisionGroup = 'Particles';
				
				const particles = new Set<BasePart>();
				for (const i of $range(1, totalParticles)) {
					const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi);
					const spreadDirection = getPointOn3dCircle(normalVector, normalVector.Unit, RNG.NextNumber(0.3, 2), theta);
					
					const particle = Instance.fromExisting(baseParticle);
					particle.Size = Vector3.one.mul(RNG.NextNumber(1.5, 3));
					particle.CFrame = CFrame.lookAlong(result.Position, RNG.NextUnitVector());
					particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(60, 80));
					particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
					particle.Parent = effectsFolder;
					
					const tween = TweenService.Create(particle, tweenInfo, tweenProperties);
					tween.Play();
					
					particles.add(particle);
				}
				
				baseParticle.Destroy();
				
				task.delay(tweenInfo.Time, () => {
					for (const particle of particles) {
						particle.Destroy();
					}
				});
				
				if (impactMagnitude > 450) {
					effectIntensity = math.clamp(1 + (impactMagnitude - 160) / 10, 1, 5);
					const tweenInfo = new TweenInfo(20, Enum.EasingStyle.Linear);
					
					const radius = 10 * math.log((impactMagnitude - 300) / 10, 2);
					const totalParts = math.floor(radius / 2);
					const randomAngleOffset = math.rad(5);
					
					const blocks = new Set<BasePart>();
					for (const i of $range(1, totalParts)) {
						const theta = math.map(i, 1, totalParticles, 0, 2 * math.pi) + RNG.NextNumber(-randomAngleOffset, randomAngleOffset);
						const point = getPointOn3dCircle(result.Position, result.Normal, radius, theta);
						
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
						
						const tween = TweenService.Create(block, tweenInfo, {
							Position: block.Position.add(subResult.Normal.mul(-block.Size.Y)),
							LocalTransparencyModifier: 1,
						});
						
						tween.Play();
						
						blocks.add(block);
					}
					
					task.delay(tweenInfo.Time, () => {
						for (const block of blocks) {
							block.Destroy();
						}
					});
				}
				
				ragdoll(effectIntensity);
				shake(effectIntensity);
			}
		}
		
		previousBodyVelocity = bodyVelocity;
	});
	
	return () => {
		touchedEvent.Disconnect();
		steppedEvent.Disconnect();
	};
});
