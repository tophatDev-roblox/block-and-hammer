import { RunService, SoundService, TweenService, Workspace } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import { characterAtom } from 'client/character';
import TimeSpan from 'shared/timeSpan';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects') as Folder;

const RNG = new Random();

const hammerHitSound = SoundService.WaitForChild('HammerHit') as Sound;

interface ParticleData {
	totalParticles: number;
	colorScale: number;
}

// https://github.com/EgoMoose/Articles/blob/master/Rodrigues'%20rotation/Rodrigues'%20rotation.md
function rodriguesRotation(v: Vector3, k: Vector3, t: number): Vector3 {
	const cosTheta = math.cos(t);
	const sinTheta = math.sin(t);
	
	return v.mul(cosTheta).add(k.mul((1 - cosTheta) * v.Dot(k)).add(k.Cross(v).mul(sinTheta)));
}

function getRandomSpreadDirection(theta: number, radius: number, axisOfRotation: Vector3): Vector3 {
	const rotationVector = axisOfRotation.add(axisOfRotation.Cross(Vector3.zAxis).mul(radius));
	const velocity = rodriguesRotation(rotationVector, axisOfRotation, theta);
	return velocity;
}

function getParticleData(particle: BasePart): ParticleData {
	switch (particle.Material) {
		case Enum.Material.Grass: {
			return { totalParticles: RNG.NextInteger(3, 6), colorScale: 0.6 };
		}
		case Enum.Material.Sand: {
			return { totalParticles: RNG.NextInteger(8, 14), colorScale: 1.1 };
		}
		default: {
			print(`[client::effects] unsupported material: ${particle.Material}`);
			
			return { totalParticles: 0, colorScale: 1 };
		}
	}
}

function styleParticle(particle: BasePart): void {
	switch (particle.Material) {
		case Enum.Material.Grass: {
			particle.Transparency = 0.75;
			particle.Size = new Vector3(0.5, RNG.NextNumber(1, 3), 0.5);
			break;
		}
		case Enum.Material.Sand: {
			particle.Transparency = 0.5;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.2, 0.6));
			break;
		}
		default: {
			particle.Size = new Vector3(1, 1, 1);
			break;
		}
	}
}

effect(() => {
	const character = characterAtom();
	if (character === undefined) {
		return;
	}
	
	const body = character.WaitForChild('Body') as Part;
	const hammer = character.WaitForChild('Hammer') as Model;
	const head = hammer.WaitForChild('Head') as Part;
	
	let hammerVelocity = Vector3.zero;
	let lastEffectTime = -1;
	
	const touchedEvent = head.Touched.Connect((otherPart) => {
		if (TimeSpan.timeSince(lastEffectTime) < TimeSpan.seconds(0.1)) {
			return;
		}
		
		let magnitude = hammerVelocity.sub(otherPart.AssemblyLinearVelocity).sub(body.AssemblyLinearVelocity.div(4)).Magnitude;
		magnitude *= 1.5;
		if (magnitude < 50) {
			return;
		}
		
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = [mapFolder];
		
		const otherPoint = otherPart.GetClosestPointOnSurface(head.Position);
		const direction = otherPoint.sub(head.Position);
		const result = Workspace.Raycast(head.Position.sub(direction), direction.mul(3), params);
		if (result === undefined) {
			return;
		}
		
		const targetPart = result.Instance;
		const point = targetPart.GetClosestPointOnSurface(head.Position);
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
		
		const axisOfRotation = result.Normal.Unit;
		if (magnitude > 165) {
			const tweenInfo = new TweenInfo(5, Enum.EasingStyle.Linear);
			
			const velocityStrength = math.min((magnitude - 140) / 15, 15);
			const totalParticles = RNG.NextInteger(10, 20);
			for (const i of $range(1, totalParticles)) {
				const theta = (i - 1) / (totalParticles - 1) * 2 * math.pi;
				const spreadDirection = getRandomSpreadDirection(theta, RNG.NextNumber(0.1, 1), axisOfRotation);
				
				const particle = Instance.fromExisting(baseParticle);
				particle.Size = Vector3.one.mul(RNG.NextNumber(0.6, 1.2));
				particle.CFrame = CFrame.lookAlong(point, RNG.NextUnitVector());
				particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(5, 6) * velocityStrength).add(inheritedVelocity);
				particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
				particle.Parent = effectsFolder;
				
				const tween = TweenService.Create(particle, tweenInfo, tweenProperties);
				tween.Play();
				
				tween.Completed.Connect(() => particle.Destroy());
			}
			
			baseParticle.Destroy();
			
			const sound = hammerHitSound.Clone();
			sound.TimePosition = 0.1;
			sound.Parent = Workspace;
			sound.Destroy();
		} else if (magnitude > 50) {
			const tweenInfo = new TweenInfo(3, Enum.EasingStyle.Linear);
			
			const { totalParticles, colorScale } = getParticleData(baseParticle);
			baseParticle.Color = new Color3(
				baseParticle.Color.R * colorScale,
				baseParticle.Color.G * colorScale,
				baseParticle.Color.B * colorScale,
			);
			
			for (const i of $range(1, totalParticles)) {
				const theta = (i - 1) / (totalParticles - 1) * 2 * math.pi;
				const spreadDirection = getRandomSpreadDirection(theta, RNG.NextNumber(0.2, 0.7), axisOfRotation);
				
				const particle = Instance.fromExisting(baseParticle);
				styleParticle(particle);
				particle.CFrame = CFrame.lookAlong(point, RNG.NextUnitVector());
				particle.AssemblyLinearVelocity = spreadDirection.Unit.mul(RNG.NextNumber(40, 50)).add(inheritedVelocity);
				particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
				particle.Parent = effectsFolder;
				
				const tween = TweenService.Create(particle, tweenInfo, tweenProperties);
				tween.Play();
				
				tween.Completed.Connect(() => particle.Destroy());
			}
			
			baseParticle.Destroy();
		}
		
		lastEffectTime = os.clock();
	});
	
	const steppedEvent = RunService.Stepped.Connect(() => {
		hammerVelocity = head.AssemblyLinearVelocity;
		// i just copied the hit detection from the original block and hammer,
		// not sure why this works so much better than getting AssemblyLinearVelocity directly
	});
	
	return () => {
		touchedEvent.Disconnect();
		steppedEvent.Disconnect();
	};
});
