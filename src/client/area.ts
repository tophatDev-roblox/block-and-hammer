import { Workspace } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';
import { effect } from '@rbxts/charm';

import { waitForChild } from 'shared/waitForChild';
import { AreaManager } from 'shared/areaManager';
import { CharacterState } from 'client/character/state';
import { UserSettings } from './userSettings';
import { Leaderstats } from './leaderstats';
import { Logger } from 'shared/logger';

const logger = new Logger('area');
const areaManager = new AreaManager();

(async () => {
	const areasFolder = await waitForChild(Workspace, 'Areas', 'Folder');
	
	for (const area of areasFolder.GetChildren()) {
		areaManager.processArea(area);
	}
	
	areasFolder.ChildAdded.Connect((area) => areaManager.processArea(area));
})();

effect(() => {
	const leaderstats = Leaderstats.stateAtom();
	if (leaderstats === undefined) {
		return;
	}
	
	const area = CharacterState.areaAtom();
	leaderstats.area.Value = area;
	
	logger.print('area changed to', area);
});

effect(() => {
	const userSettings = UserSettings.stateAtom();
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		CharacterState.areaAtom(AreaManager.Area.Unknown);
		return;
	}
	
	const currentArea = CharacterState.areaAtom();
	
	const body = characterParts.body;
	const currentRegion = areaManager.areas.get(currentArea);
	
	const clearInterval = setInterval(() => {
		if (currentRegion !== undefined && areaManager.isInArea(body, currentRegion)) {
			return;
		}
		
		for (const [area, region] of areaManager.areas) {
			if (areaManager.isInArea(body, region)) {
				CharacterState.areaAtom(area);
				return;
			}
		}
		
		CharacterState.areaAtom(AreaManager.Area.Unknown);
	}, userSettings.areaUpdateInterval);
	
	return () => {
		clearInterval();
	};
});
