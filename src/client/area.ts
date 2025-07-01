import { Players, Workspace } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';
import { effect } from '@rbxts/charm';

import { Number } from 'shared/number';
import { CharacterState } from 'client/character/state';
import { UserSettings } from './settings';

type Region2 = [Vector2, Vector2];

const client = Players.LocalPlayer;
const leaderstats = client.WaitForChild('leaderstats') as Folder;
const areaValue = leaderstats.WaitForChild('Area') as StringValue;
const areasFolder = Workspace.WaitForChild('Areas') as Folder;

const validAreas = new Map<CharacterState.Area, Region2>();

function processArea(area: Instance): void {
	if (!area.IsA('Model')) {
		return;
	}
	
	const pointA = area.FindFirstChild('A');
	const pointB = area.FindFirstChild('B');
	if (!pointA?.IsA('Part') || !pointB?.IsA('Part')) {
		warn('[client::area] area is missing A and B Part instances:', area);
		return;
	}
	
	const a = new Vector2(pointA.Position.X, pointA.Position.Y);
	const b = new Vector2(pointB.Position.X, pointB.Position.Y);
	validAreas.set(area.Name as CharacterState.Area, [a.Min(b), a.Max(b)]);
}

function isInArea(body: Part, region: Region2): boolean {
	const minimumX = region[0].X;
	const minimumY = region[0].Y;
	const maximumX = region[1].X;
	const maximumY = region[1].Y;
	return Number.isInRange(body.Position.X, minimumX, maximumX) && Number.isInRange(body.Position.Y, minimumY, maximumY);
}

for (const area of areasFolder.GetChildren()) {
	processArea(area);
}

areasFolder.ChildAdded.Connect(processArea);

effect(() => {
	const area = CharacterState.areaAtom();
	areaValue.Value = area;
	
	print('[client::area] area changed to', area);
});

effect(() => {
	const userSettings = UserSettings.stateAtom();
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		CharacterState.areaAtom(CharacterState.Area.Unknown);
		return;
	}
	
	const currentArea = CharacterState.areaAtom();
	
	const body = characterParts.body;
	const currentRegion = validAreas.get(currentArea);
	
	const clearInterval = setInterval(() => {
		if (currentRegion !== undefined && isInArea(body, currentRegion)) {
			return;
		}
		
		for (const [area, region] of validAreas) {
			if (isInArea(body, region)) {
				CharacterState.areaAtom(area);
				return;
			}
		}
		
		CharacterState.areaAtom(CharacterState.Area.Unknown);
	}, userSettings.areaUpdateInterval);
	
	return () => {
		clearInterval();
	};
});
