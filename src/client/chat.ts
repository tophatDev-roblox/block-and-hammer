import { Players, TextChatService } from '@rbxts/services';
import { Remotes } from 'shared/events';

const textChannels = TextChatService.WaitForChild('TextChannels') as Folder;
const rbxGeneral = textChannels.WaitForChild('RBXGeneral') as TextChannel;

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
