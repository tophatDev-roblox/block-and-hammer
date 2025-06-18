import { CommandContext } from '@rbxts/centurion';

import { GroupId } from 'shared/constants';

const cachedRanks = new Map<number, number>();

function getRank(player: Player, groupId: number): number {
	if (!cachedRanks.has(player.UserId)) {
		cachedRanks.set(player.UserId, player.GetRankInGroup(groupId));
	}
	
	return cachedRanks.get(player.UserId)!;
}

export function createGroupRankGuard(mininumRank: number, groupId: number = GroupId): (ctx: CommandContext) => boolean {
	return (ctx) => {
		if (getRank(ctx.executor, groupId) < mininumRank) {
			ctx.error('Insufficient permission!');
			return false;
		}
		
		return true;
	};
}
