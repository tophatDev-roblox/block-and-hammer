import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';
import { FontStyleData } from 'client/stylesParser';

import defaultStyles from 'client/stylesParser/default';

function loadStyleFont(font: FontStyleData): Font {
	let fontWeight: Enum.FontWeight | undefined = undefined;
	for (const weight of Enum.FontWeight.GetEnumItems()) {
		if (weight.Value === font.weight) {
			fontWeight = weight;
			break;
		}
	}
	
	if (fontWeight === undefined) {
		warn(`[client::centurion] ui style text font weight is invalid (${font.weight}), falling back to 400`);
	}
	
	return new Font(font.fontId, fontWeight, font.italics ? Enum.FontStyle.Italic : Enum.FontStyle.Normal);
}

const client = Centurion.client();

client.registry.registerGroup(
	{ name: 'teleport', description: 'subcommands for teleporting yourself' },
);

const commandsContainer = script.FindFirstChild('commands')!;
client.registry.load(commandsContainer);

client.start()
	.then(() => {
		CenturionUI.start(client, {
			activationKeys: [Enum.KeyCode.Semicolon],
			position: new UDim2(0.5, 0, 0.5, -88),
			anchor: new Vector2(0.5, 0),
			font: {
				bold: loadStyleFont(defaultStyles.text.centurion.bold),
				medium: loadStyleFont(defaultStyles.text.centurion.medium),
				regular: loadStyleFont(defaultStyles.text.centurion.regular),
			},
		});
		
		print('[client::centurion] started');
	})
	.catch((err) => {
		warn('[client::centurion] failed to start centurion:', err);
	});
