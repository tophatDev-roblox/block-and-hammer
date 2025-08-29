import { Players, ReplicatedStorage } from '@rbxts/services';

import { t } from '@rbxts/t';

import { CharacterParts } from 'shared/character-parts';
import { waitForChild } from 'shared/wait-for-child';
import { Logger } from 'shared/logger';
import { Badge } from 'shared/badge';

const client = Players.LocalPlayer;

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
	
	export const tCategory = t.union(t.literal(0), t.literal(1), t.literal(2));
	export const enum Category {
		Hats,
		Eyes,
		Mouth,
	}
	
	export const tType = t.union(t.literal(0), t.literal(1));
	export const enum Type {
		Model,
		Decal,
	}
	
	export type BaseAccessory = t.static<typeof BaseAccessory>;
	export const BaseAccessory = t.strictInterface({
		type: tType,
		category: tCategory,
		displayName: t.string,
		description: t.string,
		obtainment: t.strictInterface({
			badgeId: t.optional(t.number),
			dollars: t.optional(t.number),
		}),
	});
	
	export type ModelAccessory = t.static<typeof ModelAccessory>;
	export const ModelAccessory = t.intersection(BaseAccessory, t.strictInterface({
		type: t.literal(0),
		modelName: t.string,
		displayOffset: t.CFrame,
	}));
	
	export type DecalAccessory = t.static<typeof DecalAccessory>;
	export const DecalAccessory = t.intersection(BaseAccessory, t.strictInterface({
		type: t.literal(1),
		decalName: t.string,
	}));
	
	export type EquippedAccessories = t.static<typeof EquippedAccessories>;
	export const EquippedAccessories = t.strictInterface({
		hat: t.set(t.string),
		eye: t.optional(t.string),
		mouth: t.optional(t.string),
	});
	
	export const defaultEquippedAccessories: EquippedAccessories = {
		hat: new Set(),
		eye: undefined,
		mouth: undefined,
	};
	
	table.freeze(defaultEquippedAccessories);
	
	export const Accessories = {
		Hats: {
			tophatStack: {
				type: Type.Model,
				category: Category.Hats,
				displayName: 'Tophat Stack',
				description: 'A stack of tophats',
				modelName: 'TophatStack',
				displayOffset: new CFrame(0, -6, 0),
				obtainment: {
					dollars: undefined,
					badgeId: Badge.Id.LegacyWelcome, // TODO: replace with met dev badge
				},
			},
		} as Record<string, ModelAccessory>,
		Eyes: {} as Record<string, DecalAccessory>,
		Mouth: {} as Record<string, DecalAccessory>,
	};
	
	export function ofCategory(category: Category.Hats): Record<string, ModelAccessory>;
	export function ofCategory(category: Category.Eyes): Record<string, DecalAccessory>;
	export function ofCategory(category: Category.Mouth): Record<string, DecalAccessory>;
	export function ofCategory(category: Category): Record<string, BaseAccessory>;
	export function ofCategory(category: Category): Record<string, BaseAccessory> {
		switch (category) {
			case Category.Hats: {
				return Accessories.Hats;
			}
			case Category.Eyes: {
				return Accessories.Eyes;
			}
			case Category.Mouth: {
				return Accessories.Mouth;
			}
			default: {
				throw logger.format('unknown type:', category);
			}
		}
	}
	
	export async function getAccessoryModel(modelName: string): Promise<Model> {
		return await waitForChild(accessoriesFolder, modelName, 'Model');
	}
	
	export async function applyAccessories(characterParts: CharacterParts.Value, accessories: EquippedAccessories): Promise<void> {
		characterParts.accesories.models.hat?.Destroy();
		characterParts.accesories.constraints.hat.Attachment1 = undefined;
		
		for (const uid of accessories.hat) {
			const accessory = Accessories.Hats[uid];
			
			if (accessory === undefined) {
				logger.warn('accessory uid does not exist:', uid);
				
				continue;
			}
			
			const model = await getAccessoryModel(accessory.modelName);
			const rigidAttachment = model.FindFirstChild('RigidAttachment1', true);
			
			if (model !== undefined && rigidAttachment?.IsA('Attachment')) {
				const hat = model.Clone();
				hat.Name = Name.Hat;
				
				characterParts.accesories.constraints.hat.Attachment1 = rigidAttachment;
				
				hat.Parent = characterParts.model;
			} else {
				logger.warn('accessory model does not contain RigidAttachment1 or does not exist:', accessory.modelName, accessory);
			}
		}
	}
	
	export function isEquipped(accessory: BaseAccessory, uid: string, equippedAccessories: EquippedAccessories): boolean {
		switch (accessory.category) {
			case Category.Hats: {
				return equippedAccessories.hat.has(uid);
			}
			case Category.Eyes: {
				return equippedAccessories.eye === uid;
			}
			case Category.Mouth: {
				return equippedAccessories.mouth === uid;
			}
		}
		
		return false;
	}
	
	export async function doesOwnAccessory(accessory: BaseAccessory, uid: string, boughtAccessories: Set<string>, player: Player = client): Promise<boolean> {
		if (accessory.obtainment.badgeId !== undefined) {
			return await Badge.has(accessory.obtainment.badgeId, player);
		} else if (accessory.obtainment.dollars !== undefined) {
			return boughtAccessories.has(uid);
		}
		
		return false;
	}
}
