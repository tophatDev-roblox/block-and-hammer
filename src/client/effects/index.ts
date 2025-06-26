import { RunService, SoundService, TweenService, Workspace } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import { cameraShake, characterAtom, ragdoll } from 'client/character';
import { materialConfiguration } from './materials';
import TimeSpan from 'shared/timeSpan';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects') as Folder;
const hammerHitSound = SoundService.WaitForChild('HammerHit') as Sound;
const explosionSound = SoundService.WaitForChild('Explosion') as Sound;

const RNG = new Random();

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
	
	let previousBodyVelocity = character.body.AssemblyLinearVelocity.Magnitude;
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
		
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = [mapFolder];
		
		const otherPoint = otherPart.GetClosestPointOnSurface(character.hammer.head.Position);
		const direction = otherPoint.sub(character.hammer.head.Position);
		const result = Workspace.Raycast(character.hammer.head.Position.sub(direction), direction.mul(3), params);
		if (result === undefined) {
			return;
		}
		
		const targetPart = result.Instance;
		const point = targetPart.GetClosestPointOnSurface(character.hammer.head.Position);
		const inheritedVelocity = hammerVelocity.mul(-0.2);
		
		const tweenProperties: Partial<ExtractMembers<BasePart, Tweenable>> = {
			Size: Vector3.zero,
			LocalTransparencyModifier: 1,
		};
		
		const baseParticle = Instance.fromExisting(targetPart);
		baseParticle.Anchored = false;
		baseParticle.Massless = true;
		baseParticle.CanCollide = true;
		baseParticle.CastShadow = false;
		baseParticle.CollisionGroup = 'Particles';
		
		const normalVector = result.Normal.Unit;
		if (magnitude > 165) {
			const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear);
			
			const velocityStrength = math.min((magnitude - 140) / 15, 15);
			const totalParticles = RNG.NextInteger(10, 20);
			
			const particles = new Set<BasePart>();
			for (const i of $range(1, totalParticles)) {
				const theta = (i - 1) / (totalParticles - 1) * 2 * math.pi;
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
				const theta = (i - 1) / (totalParticles - 1) * 2 * math.pi;
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
		
		const bodyVelocity = character.body.AssemblyLinearVelocity.Magnitude;
		if (character.model.GetAttribute('justReset')) {
			previousBodyVelocity = bodyVelocity;
			character.model.SetAttribute('justReset', undefined);
		}
		
		const impactMagnitude = math.abs(bodyVelocity - previousBodyVelocity);
		if (impactMagnitude > 130) {
			ragdoll(math.clamp(1 + (impactMagnitude - 160) / 10, 1, 3));
			cameraShake(2);
			
			const sound = explosionSound.Clone() as Sound;
			sound.PlaybackSpeed = RNG.NextNumber(0.97, 1.03);
			sound.Parent = Workspace;
			sound.Destroy();
			
			const explosion = new Instance('Explosion');
			explosion.Position = character.body.Position;
			explosion.BlastPressure = 0;
			explosion.BlastRadius = 0;
			explosion.ExplosionType = Enum.ExplosionType.NoCraters;
			explosion.Parent = Workspace;
		}
		
		previousBodyVelocity = bodyVelocity;
	});
	
	return () => {
		touchedEvent.Disconnect();
		steppedEvent.Disconnect();
	};
});
