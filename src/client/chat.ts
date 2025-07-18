import { Players, TextChatService } from '@rbxts/services';

import { Remotes } from 'shared/remotes';
import { waitForChild } from 'shared/wait-for-child';

(async () => {
	const textChannels = await waitForChild(TextChatService, 'TextChannels', 'Folder');
	const rbxGeneral = await waitForChild(textChannels, 'RBXGeneral', 'TextChannel');
	
	TextChatService.OnBubbleAdded = (textChatMessage): BubbleChatMessageProperties | undefined => {
		const player = textChatMessage.TextSource ? Players.GetPlayerByUserId(textChatMessage.TextSource.UserId) : undefined;
		const character = player?.Character;
		if (player !== undefined && character !== undefined && textChatMessage.Status === Enum.TextChatMessageStatus.Success) {
			TextChatService.DisplayBubble(character.FindFirstChild('BubbleChatOrigin')!, textChatMessage.Text);
		}
		
		return undefined;
	};
	
	Remotes.sendSystemMessage.connect((message) => {
		rbxGeneral.DisplaySystemMessage(message);
	});
})();
