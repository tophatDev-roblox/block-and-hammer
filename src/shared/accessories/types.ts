import { t } from '@rbxts/t';

import { Accessories } from '../accessories';

export namespace AccessoryTypes {
	export type BaseAccessory = t.static<typeof BaseAccessory>;
	export const BaseAccessory = t.strictInterface({
		order: t.number,
		type: Accessories.tType,
		category: Accessories.tCategory,
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
}
