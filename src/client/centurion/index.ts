import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';

import { Logger } from 'shared/logger';

import { StyleParse } from 'shared/styles';
import defaultStyles from 'shared/styles/default';

const logger = new Logger('centurion');
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
				bold: StyleParse.font(defaultStyles.centurion.text.bold),
				medium: StyleParse.font(defaultStyles.centurion.text.medium),
				regular: StyleParse.font(defaultStyles.centurion.text.regular),
			},
		});
		
		logger.print('started');
	})
	.catch((err) => {
		logger.warn('failed to start centurion:', err);
	});
