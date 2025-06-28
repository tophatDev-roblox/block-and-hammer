import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';

import { StyleParse } from 'client/styles';

import defaultStyles from 'client/styles/default';

const client = Centurion.client();

client.registry.registerGroup(
	{ name: 'teleport', description: 'subcommands for teleporting yourself' },
);

const commandsContainer = script.FindFirstChild('commands');
if (commandsContainer !== undefined) {
	client.registry.load(commandsContainer);
}

client.start()
	.then(() => {
		CenturionUI.start(client, {
			activationKeys: [Enum.KeyCode.Semicolon],
			position: new UDim2(0.5, 0, 0.5, -88),
			anchor: new Vector2(0.5, 0),
			font: {
				bold: StyleParse.font(defaultStyles.text.centurion.bold),
				medium: StyleParse.font(defaultStyles.text.centurion.medium),
				regular: StyleParse.font(defaultStyles.text.centurion.regular),
			},
		});
		
		print('[client::centurion] started');
	})
	.catch((err) => {
		warn('[client::centurion] failed to start centurion:', err);
	});
