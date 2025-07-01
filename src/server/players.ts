import { Players, ReplicatedStorage, RunService, Workspace } from '@rbxts/services';
import { throttle } from '@rbxts/set-timeout';

import computeNameColor from 'shared/NameColor';
import { Remotes } from 'shared/remotes';
import { RichText } from 'shared/richText';
import { Number } from 'shared/number';
import { MaxDollars, MinDollars } from 'shared/constants';
import { Leaderstats } from './leaderstats';
import { PlayerData } from './playerData';
import { Badge } from './badge';

const assetsFolder = ReplicatedStorage.WaitForChild('Assets');
const baseCharacter = assetsFolder.WaitForChild('BaseCharacter') as Model;

const createdCharacters = new Set<Model>();

const joinLeaveRichText = new RichText({ bold: true, italic: true, font: { size: 14 } });

async function respawn(player: Player): Promise<void> {
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
		
		if (character.GetAttribute('unloading') !== true) {
			respawn(player);
		}
	});
	
	character.Parent = Workspace;
	player.Character = character;
	
	const body = character.FindFirstChild('Body') as Part;
	body.SetNetworkOwner(player);
	
	const color = player.GetAttribute('color');
	if (typeIs(color, 'Color3')) {
		body.Color = color;
	} else {
		body.Color = computeNameColor(player.Name);
	}
}

function onFullReset(player: Player): boolean {
	respawn(player);
	
	return true;
}

function onUnloadCharacter(player: Player): void {
	const character = player.Character;
	if (character === undefined) {
		return;
	}
	
	player.Character = undefined;
	
	character.SetAttribute('unloading', true);
	character.Destroy();
}

async function onPlayerAdded(player: Player): Promise<void> {
	const profile = await PlayerData.load(player);
	if (profile === undefined) {
		return;
	}
	
	player.AttributeChanged.Connect((attribute) => {
		switch (attribute) {
			case 'color': {
				const color = player.GetAttribute(attribute);
				if (!typeIs(color, 'Color3')) {
					player.SetAttribute(attribute, profile.Data.color);
					return;
				}
				
				const body = player.Character?.FindFirstChild('Body');
				if (!body?.IsA('Part')) {
					return;
				}
				
				body.Color = color;
				profile.Data.color = color;
				
				break;
			}
			case 'dollars': {
				const dollars = tonumber(player.GetAttribute(attribute));
				if (!typeIs(dollars, 'number') || Number.isNaN(dollars)) {
					player.SetAttribute(attribute, profile.Data.dollars);
					return;
				}
				
				profile.Data.dollars = math.clamp(dollars, MinDollars, MaxDollars);
				
				break;
			}
		}
	});
	
	profile.Data.color = profile.Data.color ?? computeNameColor(player.Name);
	player.SetAttribute('dollars', profile.Data.dollars);
	player.SetAttribute('color', profile.Data.color);
	
	Badge.award(Badge.Id.Welcome, player);
	Leaderstats.apply(player);
	
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

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Remotes.fullReset.onRequest(throttle(onFullReset, 0.2));
Remotes.unloadCharacter.connect(onUnloadCharacter);
Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
RunService.Stepped.Connect(onStepped);
