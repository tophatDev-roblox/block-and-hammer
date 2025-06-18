import { CenturionType, Command, CommandContext, Register } from '@rbxts/centurion';

@Register()
export class EchoCommand {
	@Command({
		name: 'echo',
		description: 'displays text',
		arguments: [
			{ name: 'text', description: 'the text to display', type: CenturionType.String },
		],
	})
	public echo(ctx: CommandContext, text: string): void {
		ctx.reply(text);
	}
}
