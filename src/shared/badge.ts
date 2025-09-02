import { BadgeService } from '@rbxts/services';

import { setTimeout } from '@rbxts/set-timeout';

import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

const logger = new Logger('badge');

export namespace Badge {
	const awardBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.AwardBadge(userId, badgeId));
	
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
			
			Remotes.awardedBadge.fire(player, badgeId);
			
			return;
		} catch (err) {
			logger.warn(`failed to award badge ${badgeId} to ${player.Name} - error: ${err}`);
			setTimeout(() => Badge.award(badgeId, player), 0.5);
		}
	}
}
