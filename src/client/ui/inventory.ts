import { Workspace } from '@rbxts/services';

import { effect, peek, subscribe } from '@rbxts/charm';

import { CharacterParts } from 'shared/character-parts';
import { waitForChild } from 'shared/wait-for-child';
import { Accessories } from 'shared/accessories';
import { Remotes } from 'shared/remotes';

import { Camera } from 'client/camera';

import { CharacterState } from 'client/character/state';

import { UI } from 'client/ui/state';

let previewCharacterModel: Model;
let cameraPart: Part;
let body: Part;

(async () => {
	const areaFolder = await waitForChild(Workspace, 'InventoryArea', 'Folder');
	
	cameraPart = await waitForChild(areaFolder, 'Camera', 'Part');
	previewCharacterModel = await waitForChild(areaFolder, 'Character', 'Model');
	body = await waitForChild(previewCharacterModel, 'Body', 'Part');
})();

function onUpdateBoughtAccessories(boughtAccessories: Set<string>): void {
	UI.Inventory.boughtAccessoriesAtom(boughtAccessories);
}

Remotes.player.updateBoughtAccessories.connect(onUpdateBoughtAccessories);

subscribe(() => UI.stateAtom() === UI.State.Inventory, (isInventoryOpen) => {
	if (isInventoryOpen) {
		CharacterState.disableCameraAtom(true);
		
		Camera.cframeMotion.immediate(cameraPart.CFrame);
		
		UI.Inventory.temporaryAccessoriesAtom(Accessories.defaultEquippedAccessories);
		
		Remotes.player.getInventoryInfo()
			.then(([equippedAccessories, color]) => {
				UI.Inventory.temporaryAccessoriesAtom(equippedAccessories);
				
				body.Color = color;
			});
	} else {
		CharacterState.disableCameraAtom(false);
		
		const equippedAccessories = peek(UI.Inventory.temporaryAccessoriesAtom);
		
		if (equippedAccessories !== undefined) {
			Remotes.player.applyAccessories(equippedAccessories);
		}
	}
});

effect(() => {
	const equippedAccessories = UI.Inventory.temporaryAccessoriesAtom();
	
	if (equippedAccessories === undefined) {
		return;
	}
	
	CharacterParts.create(previewCharacterModel)
		.then((previewCharacterParts) => Accessories.applyAccessories(previewCharacterParts, equippedAccessories));
});
