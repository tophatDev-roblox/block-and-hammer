import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';

import { Styles, StyleParse } from 'shared/styles';
import { Logger } from 'shared/logger';

const logger = new Logger('centurion');
const client = Centurion.client();

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
				bold: StyleParse.font(Styles.Default.centurion.text.bold),
				medium: StyleParse.font(Styles.Default.centurion.text.medium),
				regular: StyleParse.font(Styles.Default.centurion.text.regular),
			},
		});
		
		logger.print('started');
	})
	.catch((err) => {
		logger.warn('failed to start centurion:', err);
	});
