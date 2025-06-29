import { Players, ReplicatedStorage, RunService, Workspace } from '@rbxts/services';

import computeNameColor from 'shared/NameColor';
import { Remotes } from 'shared/events';
import { Leaderstats } from './leaderstats';
import { PlayerData } from './playerData';
import { Badge } from './badge';
import { RichText } from 'shared/richText';

const assetsFolder = ReplicatedStorage.WaitForChild('Assets');
const baseCharacter = assetsFolder.WaitForChild('BaseCharacter') as Model;

const createdCharacters = new Set<Model>();

const joinLeaveRichText = new RichText({ bold: true, italic: true, font: { size: 14 } });

function respawn(player: Player): void {
	const existingCharacter = Workspace.FindFirstChild(player.Name) ?? player.Character;
	if (existingCharacter?.IsA('Model') && existingCharacter.Parent !== undefined) {
		existingCharacter.Destroy();
		createdCharacters.delete(existingCharacter);
		player.Character = undefined;
		return;
	}
	
	const character = baseCharacter.Clone();
	character.Name = player.Name;
	
	// TODO: better system for billboard gui (+ make size responsive)
	const billboardGui = character.FindFirstChildWhichIsA('BillboardGui', true)!;
	billboardGui.PlayerToHideFrom = player;
	(billboardGui.FindFirstChild('DisplayName') as TextLabel).Text = player.DisplayName;
	(billboardGui.FindFirstChild('Username') as TextLabel).Text = `@${player.Name}`;
	
	createdCharacters.add(character);
	
	character.Destroying.Once(() => {
		createdCharacters.delete(character);
		respawn(player);
	});
	
	character.Parent = Workspace;
	
	const body = character.FindFirstChild('Body') as Part;
	body.Color = player.GetAttribute('color') as Color3;
	body.SetNetworkOwner(player);
	
	player.Character = character;
}

function onPlayerAdded(player: Player): void {
	const profile = PlayerData.load(player);
	if (profile === undefined) {
		return;
	}
	
	profile.Data.color = profile.Data.color ?? computeNameColor(player.Name);
	player.SetAttribute('dollars', profile.Data.dollars);
	player.SetAttribute('color', profile.Data.color);
	
	Badge.award(Badge.Id.Welcome, player);
	Leaderstats.apply(player);
	respawn(player);
	
	const playerRichText = new RichText({ font: { color: player.GetAttribute('color') as Color3 } });
	Remotes.sendSystemMessage.fireAllExcept(player, joinLeaveRichText.apply(playerRichText.apply(`${player.DisplayName} joined the server`)));
}

function onPlayerRemoving(player: Player): void {
	player.Character?.Destroy();
	PlayerData.unload(player);
	
	const playerRichText = new RichText({ font: { color: player.GetAttribute('color') as Color3 } });
	Remotes.sendSystemMessage.fireAll(joinLeaveRichText.apply(playerRichText.apply(`${player.DisplayName} left the server`)));
}

function onStepped(_time: number, _dt: number): void {
	for (const character of createdCharacters) {
		const body = character.PrimaryPart;
		if (body === undefined) {
			continue;
		}
		
		if (body.Position.Y < -1e3) {
			createdCharacters.delete(character);
			character.Destroy();
		}
	}
}

function onFullReset(player: Player): void {
	respawn(player);
}

for (const player of Players.GetPlayers()) {
	task.spawn(onPlayerAdded, player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
RunService.Stepped.Connect(onStepped);
Remotes.fullReset.connect(onFullReset);
