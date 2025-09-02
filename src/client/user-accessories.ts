import { Accessories } from 'shared/accessories';

import { UserBadges } from 'client/user-badges';

export namespace UserAccessories {
	export async function doesOwnAccessory(accessory: Accessories.BaseAccessory, uid: string, boughtAccessories: Set<string>): Promise<boolean> {
		if (accessory.obtainment.badgeId !== undefined) {
			return await UserBadges.has(accessory.obtainment.badgeId);
		} else if (accessory.obtainment.dollars !== undefined) {
			return boughtAccessories.has(uid);
		}
		
		return false;
	}
}
