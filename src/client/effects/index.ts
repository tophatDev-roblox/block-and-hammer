import { Debris, RunService, Workspace } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import { characterAtom } from 'client/character';
import TimeSpan from 'shared/timeSpan';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
// const effectsFolder = Workspace.WaitForChild('Effects') as Folder;
const materialsFolder = script.WaitForChild('materials') as Folder;

const RNG = new Random();

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
		} else if (magnitude > 35) {
			const params = new RaycastParams();
			params.FilterType = Enum.RaycastFilterType.Include;
			params.FilterDescendantsInstances = [otherPart];
			
			const result = Workspace.Raycast(head.Position, point.sub(head.Position).mul(2), params);
			if (result === undefined) {
				return;
			}
			
			const materialModule = materialsFolder.FindFirstChild(otherPart.Material.Name.lower()); // TODO: better particles system
			if (materialModule?.IsA('ModuleScript')) {
				try {
					const attachment = require(materialModule) as Attachment;
					
					const effect = attachment.Clone();
					effect.Position = point;
					effect.CFrame = CFrame.lookAlong(point, result.Normal);
					effect.FindFirstChildWhichIsA('ParticleEmitter')!.Emit(RNG.NextInteger(5, 10));
					effect.Parent = Workspace.FindFirstChild('Terrain');
					
					Debris.AddItem(effect, 3);
				} catch (err) {
					print(`[client::effects] failed to run effect module for ${otherPart.Material}:`, err);
				}
			} else {
				print(`[client::effects] unknown material: ${otherPart.Material}`);
			}
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
