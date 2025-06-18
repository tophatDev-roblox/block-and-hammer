import { CenturionType, Command, CommandContext, Group, Guard, Register } from '@rbxts/centurion';

import { createGroupRankGuard } from 'shared/centurion/guards';
import { MaxDollars, MinDollars } from 'shared/constants';
import Number from 'shared/number';

@Register()
@Group('dollars')
@Guard(createGroupRankGuard(200))
export class DollarsCommands {
	@Command({
		name: 'set',
		description: 'sets your dollars amount',
		arguments: [
			{ name: 'dollars', description: 'amount to set', type: CenturionType.Number },
		],
	})
	public set(ctx: CommandContext, dollars: number): void {
		if (Number.isNaN(dollars)) {
			ctx.reply('Cannot set dollars to NaN');
			return;
		}
		
		const clampedDollars = math.clamp(dollars, MinDollars, MaxDollars);
		
		ctx.executor.SetAttribute('dollars', clampedDollars);
		ctx.reply(`Set dollars to ${clampedDollars}`);
	}
	
	@Command({
		name: 'add',
		description: 'adds to your dollars amount',
		arguments: [
			{ name: 'dollars', description: 'amount to add', type: CenturionType.Number },
		],
	})
	public add(ctx: CommandContext, dollars: number): void {
		if (Number.isNaN(dollars)) {
			ctx.reply('Cannot add NaN dollars');
			return;
		}
		
		const newDollars = (tonumber(ctx.executor.GetAttribute('dollars')) ?? 0) + dollars;
		const clampedDollars = math.clamp(newDollars, MinDollars, MaxDollars);
		
		ctx.executor.SetAttribute('dollars', clampedDollars);
		ctx.reply(`Added ${dollars} dollars`);
	}
}
