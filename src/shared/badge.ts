import { BadgeService } from '@rbxts/services';

import { setTimeout } from '@rbxts/set-timeout';

import { TimeSpan } from 'shared/time-span';
import { Logger } from 'shared/logger';

const logger = new Logger('badge');

const awardBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.AwardBadge(userId, badgeId));
const hasBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.UserHasBadgeAsync(userId, badgeId));

export namespace Badge {
	export const enum Id {
		Welcome = -1,
		LegacyWelcome = 1967915839777317,
	}
	
	export async function award(badgeId: Badge.Id, player: Player): Promise<void> {
		try {
			if (badgeId !== -1) {
				await awardBadge(player.UserId, badgeId);
			} else {
				logger.warn('placeholder badge');
			}
			
			return;
		} catch (err) {
			logger.warn(`failed to award badge ${badgeId} to ${player.Name} error: ${err}`);
			setTimeout(() => Badge.award(badgeId, player), 0.5);
		}
	}
	
	export async function has(badgeId: Badge.Id, player: Player): Promise<boolean> {
		try {
			return await hasBadge(player.UserId, badgeId);
		} catch (err) {
			logger.warn(`failed to award badge ${badgeId} to ${player.Name} error: ${err}`);
			
			await TimeSpan.sleep(0.5);
			return await Badge.has(badgeId, player);
		}
	}
}
