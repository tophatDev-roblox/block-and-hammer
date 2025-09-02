import { BadgeService, Players } from '@rbxts/services';

import { TimeSpan } from 'shared/time-span';
import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';
import { Badge } from 'shared/badge';

const client = Players.LocalPlayer;

const logger = new Logger('user-badges');

export namespace UserBadges {
	export const cache = new Map<number, boolean>();
	
	const hasBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.UserHasBadgeAsync(userId, badgeId));
	
	Remotes.awardedBadge.connect((badgeId) => {
		cache.set(badgeId, true);
	});
	
	export async function has(badgeId: Badge.Id): Promise<boolean> {
		try {
			if (!cache.has(badgeId)) {
				cache.set(badgeId, await hasBadge(client.UserId, badgeId));
			}
			
			return cache.get(badgeId)!;
		} catch (err) {
			logger.warn(`failed to check badge ${badgeId} of ${client.Name} - error: ${err}`);
			
			await TimeSpan.sleep(0.5);
			
			return await has(badgeId);
		}
	}
}
