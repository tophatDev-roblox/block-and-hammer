import { Players, ReplicatedStorage, RunService, Workspace } from '@rbxts/services';

import { applyLeaderstats } from './leaderstats';
import computeNameColor from 'shared/nameColor';
import { loadPlayer, unloadPlayer } from './profileStore';

const assetsFolder = ReplicatedStorage.WaitForChild('Assets');
const baseCharacter = assetsFolder.WaitForChild('BaseCharacter') as Model;

const createdCharacters = new Set<Model>();

function onPlayerAdded(player: Player): void {
	const profile = loadPlayer(player);
	if (profile === undefined) {
		return;
	}
	
	player.SetAttribute('dollars', profile.Data.dollars);
	player.SetAttribute('color', computeNameColor(player.Name));
	
	applyLeaderstats(player);
	respawn(player);
}

function onPlayerRemoving(player: Player): void {
	unloadPlayer(player);
	
	player.Character?.Destroy();
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

function respawn(player: Player): void {
	const existingCharacter = Workspace.FindFirstChild(player.Name);
	if (existingCharacter?.IsA('Model')) {
		existingCharacter.Destroy();
		player.Character = undefined;
	}
	
	const character = baseCharacter.Clone();
	character.Name = player.Name;
	
	// TODO: better system for billboard gui (+ make size responsive)
	const billboardGui = character.FindFirstChildWhichIsA('BillboardGui', true)!;
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

for (const player of Players.GetPlayers()) {
	task.spawn(onPlayerAdded, player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);

RunService.Stepped.Connect(onStepped);
