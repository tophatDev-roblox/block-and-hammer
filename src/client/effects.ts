import { RunService, Workspace } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import { characterAtom } from './character';

const mapFolder = Workspace.WaitForChild('Map') as Folder;
// const effectsFolder = Workspace.WaitForChild('Effects') as Folder;

effect(() => {
	const character = characterAtom();
	if (character === undefined) {
		return;
	}
	
	const body = character.WaitForChild('Body') as Part;
	const hammer = character.WaitForChild('Hammer') as Model;
	const head = hammer.WaitForChild('Head') as Part;
	
	let previousRelativeHeadPosition = head.Position;
	let relativeHammerVelocity = Vector3.zero;
	let effectDebounce = false;
	
	const touchedEvent = head.Touched.Connect((otherPart) => {
		if (!otherPart.IsDescendantOf(mapFolder) || relativeHammerVelocity.Magnitude < 0.1 || effectDebounce) {
			return;
		}
		
		const origin = head.Position;
		const direction = relativeHammerVelocity.Unit.mul(4);
		
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Include;
		params.FilterDescendantsInstances = [mapFolder];
		
		const result = Workspace.Raycast(origin, direction, params);
		if (result !== undefined) {
			effectDebounce = true;
			task.delay(0.1, () => effectDebounce = false);
			
			// TODO: effects and sound
			// const part = new Instance('Part');
			// part.Position = result.Position;
			// part.Size = Vector3.one;
			// part.Color = Color3.fromRGB(255, 0, 0);
			// part.Transparency = 0.75;
			// part.Anchored = true;
			// part.CanCollide = false;
			// part.Parent = effectsFolder;
		}
	});
	
	const renderSteppedEvent = RunService.RenderStepped.Connect(() => {
		const currentRelativePosition = head.Position.sub(body.Position);
		
		relativeHammerVelocity = currentRelativePosition.sub(previousRelativeHeadPosition);
		previousRelativeHeadPosition = currentRelativePosition;
	});
	
	return () => {
		touchedEvent.Disconnect();
		renderSteppedEvent.Disconnect();
	};
});
