import { RunService } from '@rbxts/services';
import { atom, effect } from '@rbxts/charm';
import Iris from '@rbxts/iris';

import { TestingPlaceId } from 'shared/constants';

export const isDebugPanelOpen = atom<boolean>(false);

const windowPosition = Iris.State<Vector2>(Vector2.zero);
const windowSize = Iris.State<Vector2>(new Vector2(400, 250));
const windowOpened = Iris.State<boolean>(false);

export function render(): void {
	Iris.Window(['Debug Panel', false, false, false, true], { position: windowPosition, size: windowSize, isOpened: windowOpened }); {
		
	} Iris.End();
}

if (RunService.IsStudio() || game.PlaceId === TestingPlaceId) {
	Iris.Init();
	Iris.Connect(render);
	
	effect(() => {
		windowOpened.set(isDebugPanelOpen());
	});
}
