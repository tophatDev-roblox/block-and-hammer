import { ReplicatedStorage } from '@rbxts/services';

import { t } from '@rbxts/t';

import { CharacterParts } from 'shared/character-parts';
import { waitForChild } from 'shared/wait-for-child';
import { Logger } from 'shared/logger';

const logger = new Logger('accessories');

let accessoriesFolder: Folder;

(async () => {
	const assetsFolder = await waitForChild(ReplicatedStorage, 'Assets', 'Folder');
	
	accessoriesFolder = await waitForChild(assetsFolder, 'Accessories', 'Folder');
})();

export namespace Accessories {
	export const enum Name {
		Hat = 'HatAccessory',
	}
	
	export const tType = t.union(t.literal(0));
	export const enum Type {
		Hat,
	}
	
	export type Data = t.static<typeof Data>;
	export const Data = t.interface({
		type: tType,
		displayName: t.string,
		modelName: t.string,
	});
	
	export type PlayerAccessories = t.static<typeof PlayerAccessories>;
	export const PlayerAccessories = t.interface({
		hat: t.optional(Data),
	});
	
	export const Accessories = {
		TophatStack: {
			type: Type.Hat,
			displayName: 'Tophat Stack',
			modelName: 'TophatStack',
		},
	} satisfies Record<string, Data>;
	
	export async function getAccessoryModel(modelName: string): Promise<Model> {
		return await waitForChild(accessoriesFolder, modelName, 'Model');
	}
	
	export async function applyAccessories(characterParts: CharacterParts.Value, accessories: PlayerAccessories): Promise<void> {
		characterParts.accesories.models.hat?.Destroy();
		characterParts.accesories.constraints.hat.Attachment1 = undefined;
		
		if (accessories.hat !== undefined) {
			const model = await getAccessoryModel(accessories.hat.modelName);
			
			if (model !== undefined && model.FindFirstChild('RigidAttachment1', true)?.IsA('Attachment')) {
				const hat = model.Clone();
				hat.Name = Name.Hat;
				
				const rigidAttachment = hat.FindFirstChild('RigidAttachment1', true) as Attachment;
				
				characterParts.accesories.constraints.hat.Attachment1 = rigidAttachment;
				
				hat.Parent = characterParts.model;
			} else {
				logger.warn('accessory model does not contain RigidAttachment1 or does not exist:', accessories.hat.modelName, accessories.hat);
			}
		}
	}
}
