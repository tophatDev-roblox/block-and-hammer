import { CenturionType, Command, CommandContext, Group, Guard, Register } from '@rbxts/centurion';

import { createGroupRankGuard } from 'shared/centurion/guards';

@Register()
@Group('teleport')
@Guard(createGroupRankGuard(200))
export class TeleportCommand {
	@Command({
		name: 'player',
		description: 'teleport to a player',
		arguments: [
			{ name: 'toPlayer', description: 'the player to teleport to', type: CenturionType.Player },
		],
	})
	public player(ctx: CommandContext, targetPlayer: Player): void {
		const character = ctx.executor.Character;
		if (character === undefined) {
			ctx.error('Executor character is undefined');
			return;
		}
		
		const toCharacter = targetPlayer.Character;
		if (toCharacter === undefined) {
			ctx.error('Target character is undefined');
			return;
		}
		
		character.PivotTo(toCharacter.GetPivot());
		ctx.reply(`Teleported to ${targetPlayer.DisplayName} (@${targetPlayer.Name})`);
	}
	
	@Command({
		name: 'level',
		description: 'teleport to a level',
		arguments: [
			{ name: 'toLevel', description: 'the level to teleport to', type: CenturionType.String, suggestions: ['1'] },
		],
	})
	public level(ctx: CommandContext, level: string): void {
		const character = ctx.executor.Character;
		if (character === undefined) {
			ctx.error('Executor character is undefined');
			return;
		}
		
		const pivotRotation = character.GetPivot().Rotation;
		switch (level.lower()) {
			case '1': {
				character.PivotTo(new CFrame(0, 10, 0).mul(pivotRotation));
				break;
			}
			default: {
				ctx.error(`Unknown level: '${level}'`);
				return;
			}
		}
		
		ctx.reply(`Teleported to level: '${level}'`);
	}
}
