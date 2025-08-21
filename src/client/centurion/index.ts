import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';

import { Styles } from 'client/styles';

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
				regular: Styles.Centurion.text.regular,
				medium: Styles.Centurion.text.medium,
				bold: Styles.Centurion.text.bold,
			},
		});
		
		logger.print('started');
	})
	.catch((err) => {
		logger.warn('failed to start centurion:', err);
	});
