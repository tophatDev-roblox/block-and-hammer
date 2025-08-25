import { Workspace } from '@rbxts/services';

import { effect } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';

import { Camera } from 'client/camera';

import { CharacterState } from 'client/character/state';

import { UI } from 'client/ui/state';

let wasInventoryOpen = false;

let cameraPart: Part;

(async () => {
	const areaFolder = await waitForChild(Workspace, 'InventoryArea', 'Folder');
	
	cameraPart = await waitForChild(areaFolder, 'Camera', 'Part');
})();

effect(() => {
	const state = UI.stateAtom();
	
	if (state === UI.State.Inventory) {
		if (wasInventoryOpen) {
			return;
		}
		
		wasInventoryOpen = true;
		
		CharacterState.disableCameraAtom(true);
		
		Camera.cframeMotion.immediate(cameraPart.CFrame);
	} else {
		if (!wasInventoryOpen) {
			return;
		}
		
		wasInventoryOpen = false;
		
		CharacterState.disableCameraAtom(false);
	}
});
