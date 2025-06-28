import { BadgeService } from '@rbxts/services';

const awardBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.AwardBadge(userId, badgeId));
const hasBadge = Promise.promisify((userId: number, badgeId: number) => BadgeService.UserHasBadgeAsync(userId, badgeId));

export namespace Badge {
	export const enum Id {
		Welcome = -1,
		LegacyWelcome = 1967915839777317,
	}
	
	export async function award(badgeId: Badge.Id, player: Player): Promise<void> {
		while (true) {
			try {
				if (badgeId !== -1) {
					await awardBadge(player.UserId, badgeId);
				} else {
					warn('[server::badge] placeholder');
				}
				
				return;
			} catch (err) {
				warn(`[server::badge] failed to award badge ${badgeId} to ${player.Name} error: ${err}`);
				task.wait(0.5);
			}
		}
	}
	
	export async function has(badgeId: Badge.Id, player: Player): Promise<boolean> {
		while (true) {
			try {
				return await hasBadge(player.UserId, badgeId);
			} catch (err) {
				warn(`[server::badge] failed to award badge ${badgeId} to ${player.Name} error: ${err}`);
				task.wait(0.5);
			}
		}
	}
}
