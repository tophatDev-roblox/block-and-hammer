import { Workspace } from '@rbxts/services';

const debugFolder = new Instance('Folder');
debugFolder.Name = 'Debug';
debugFolder.Parent = Workspace;

const baseBlock = new Instance('Part');
baseBlock.Anchored = true;
baseBlock.CanCollide = false;
baseBlock.TopSurface = Enum.SurfaceType.Smooth;
baseBlock.BottomSurface = Enum.SurfaceType.Smooth;

const baseSphere = Instance.fromExisting(baseBlock);
baseSphere.Shape = Enum.PartType.Ball;

const highlightModels = new Map<string, Model>();

export default class Debug {
	static visualizeRaycast(origin: Vector3, direction: Vector3, raycast?: RaycastResult, alternateColors?: boolean): Part {
		const originPart = Instance.fromExisting(baseSphere);
		originPart.Color = Color3.fromRGB(0, 0, 0);
		originPart.Size = Vector3.one;
		originPart.Position = origin;
		originPart.Name = 'Origin';
		this.highlight(originPart);
		
		const line = Instance.fromExisting(baseBlock);
		line.BackSurface = Enum.SurfaceType.Inlet;
		line.FrontSurface = Enum.SurfaceType.Studs;
		line.Name = 'Line';
		
		const lineThickness = 0.2;
		if (raycast !== undefined) {
			line.Color = alternateColors ? Color3.fromRGB(0, 0, 255) : Color3.fromRGB(0, 255, 0);
			line.Size = new Vector3(lineThickness, lineThickness, raycast.Distance);
			line.CFrame = CFrame.lookAlong(origin.add(direction.Unit.mul(raycast.Distance * 0.5)), direction.Unit);
		} else {
			line.Color = alternateColors ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(255, 0, 0);
			line.Size = new Vector3(lineThickness, lineThickness, direction.Magnitude);
			line.CFrame = CFrame.lookAlong(origin.add(direction.mul(0.5)), direction.Unit);
		}
		
		this.highlight(line);
		
		line.Destroying.Connect(() => {
			originPart.Destroy();
		});
		
		return line;
	}
	
	static highlight(part: BasePart): void {
		const color = part.Color;
		const hex = color.ToHex();
		if (!highlightModels.has(hex)) {
			const model = new Instance('Model');
			model.Name = hex;
			
			const highlight = new Instance('Highlight');
			highlight.Adornee = model;
			highlight.FillColor = color;
			highlight.FillTransparency = 0.5;
			highlight.OutlineTransparency = 1;
			highlight.Parent = model;
			
			model.Parent = debugFolder;
			highlightModels.set(hex, model);
		}
		
		part.Parent = highlightModels.get(hex);
	}
}
