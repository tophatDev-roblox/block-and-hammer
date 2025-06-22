import { RunService, TweenService, Workspace } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import { characterAtom } from 'client/character';
import TimeSpan from 'shared/timeSpan';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects') as Folder;

const RNG = new Random();

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

function getParticleData(particle: BasePart): ParticleData {
	switch (particle.Material) {
		case Enum.Material.Grass: {
			return { totalParticles: RNG.NextInteger(3, 6), colorScale: 0.6 };
		}
		case Enum.Material.Sand: {
			return { totalParticles: RNG.NextInteger(8, 12), colorScale: 1.1 };
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
			particle.Transparency = 0.3;
			particle.Size = Vector3.one.mul(RNG.NextNumber(0.5, 1));
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
		if (!otherPart.IsDescendantOf(mapFolder) || TimeSpan.timeSince(lastEffectTime) < TimeSpan.seconds(0.2)) {
			return;
		}
		
		let magnitude = hammerVelocity.sub(otherPart.AssemblyLinearVelocity).sub(body.AssemblyLinearVelocity.div(4)).Magnitude;
		magnitude *= 1.5;
		
		const point = otherPart.GetClosestPointOnSurface(head.Position);
		if (magnitude > 165) {
			print(2);
		} else if (magnitude > 50) {
			const params = new RaycastParams();
			params.FilterType = Enum.RaycastFilterType.Include;
			params.FilterDescendantsInstances = [otherPart];
			
			const result = Workspace.Raycast(head.Position, point.sub(head.Position).mul(2), params);
			if (result === undefined) {
				return;
			}
			
			const tweenInfo = new TweenInfo(3, Enum.EasingStyle.Linear);
			const axisOfRotation = result.Normal.Unit;
			
			const baseParticle = Instance.fromExisting(otherPart);
			baseParticle.Anchored = false;
			baseParticle.Massless = true;
			baseParticle.CanCollide = true;
			baseParticle.CastShadow = false;
			baseParticle.CollisionGroup = 'Particles';
			
			const { totalParticles, colorScale } = getParticleData(baseParticle);
			baseParticle.Color = new Color3(
				baseParticle.Color.R * colorScale,
				baseParticle.Color.G * colorScale,
				baseParticle.Color.B * colorScale,
			);
			
			for (const i of $range(1, totalParticles)) {
				const radius = RNG.NextNumber(0.2, 0.7);
				const rotationVector = axisOfRotation.add(axisOfRotation.Cross(Vector3.zAxis).mul(radius));
				const theta = (i - 1) / (totalParticles - 1) * 2 * math.pi;
				const velocity = rodriguesRotation(rotationVector, axisOfRotation, theta);
				
				const particle = Instance.fromExisting(baseParticle);
				styleParticle(particle);
				particle.CFrame = CFrame.lookAlong(point, RNG.NextUnitVector());
				particle.AssemblyLinearVelocity = velocity.Unit.mul(RNG.NextNumber(40, 50));
				particle.AssemblyAngularVelocity = RNG.NextUnitVector().mul(4);
				particle.Parent = effectsFolder;
				
				const tween = TweenService.Create(particle, tweenInfo, { Transparency: 1 });
				tween.Play();
				
				tween.Completed.Connect(() => particle.Destroy());
			}
			
			baseParticle.Destroy();
		} else {
			return;
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
