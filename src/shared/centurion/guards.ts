import { CommandContext } from '@rbxts/centurion';

import { CommunityId } from 'shared/constants';

const cachedRanks = new Map<number, number>();

function getRank(player: Player, communityId: number): number {
	if (!cachedRanks.has(player.UserId)) {
		cachedRanks.set(player.UserId, player.GetRankInGroup(communityId));
	}
	
	return cachedRanks.get(player.UserId)!;
}

export function createGroupRankGuard(mininumRank: number, communityId: number = CommunityId): (ctx: CommandContext) => boolean {
	return (ctx) => {
		if (getRank(ctx.executor, communityId) < mininumRank) {
			ctx.error('Insufficient permission!');
			return false;
		}
		
		return true;
	};
}
