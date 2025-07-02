import { Players, ReplicatedStorage, RunService, Workspace } from '@rbxts/services';
import { setInterval, throttle } from '@rbxts/set-timeout';

import computeNameColor from 'shared/NameColor';
import { waitForChild } from 'shared/waitForChild';
import { Remotes } from 'shared/remotes';
import { RichText } from 'shared/richText';
import { Number } from 'shared/number';
import { MaxDollars, MinDollars } from 'shared/constants';
import { AreaManager } from 'shared/areaManager';
import { Units } from 'shared/units';
import { Leaderstats } from './leaderstats';
import { PlayerData } from './playerData';
import { Badge } from './badge';

interface CharacterData {
	body: Part;
	area: AreaManager.Area;
	region?: AreaManager.Region2;
	leaderstats: {
		area: StringValue;
		altitude: IntValue;
	};
}

let baseCharacter: Model;
let areasFolder: Folder;

const areaManager = new AreaManager();
const joinLeaveRichText = new RichText({ bold: true, italic: true, font: { size: 14 } });
const characterData = new Map<Model, CharacterData>();

(async () => {
	const assetsFolder = await waitForChild(ReplicatedStorage, 'Assets', 'Folder');
	baseCharacter = await waitForChild(assetsFolder, 'BaseCharacter', 'Model');
	areasFolder = await waitForChild(Workspace, 'Areas', 'Folder');
	
	for (const area of areasFolder.GetChildren()) {
		areaManager.processArea(area);
	}
})();

setInterval(() => {
	for (const [, data] of characterData) {
		const body = data.body;
		
		if (data.region !== undefined && areaManager.isInArea(body, data.region)) {
			continue;
		}
		
		let didFindArea = false;
		for (const [area, region] of areaManager.areas) {
			if (areaManager.isInArea(body, region)) {
				data.region = region;
				data.area = area;
				didFindArea = true;
				break;
			}
		}
		
		if (!didFindArea) {
			data.area = AreaManager.Area.Unknown;
			data.region = undefined;
		}
		
		data.leaderstats.area.Value = data.area;
	}
}, 1);

async function respawn(player: Player): Promise<void> {
	const leaderstats = await waitForChild(player, 'leaderstats', 'Folder');
	const altitudeValue = await waitForChild(leaderstats, 'Altitude', 'IntValue');
	const areaValue = await waitForChild(leaderstats, 'Area', 'StringValue');
	
	const existingCharacter = Workspace.FindFirstChild(player.Name) ?? player.Character;
	if (existingCharacter?.IsA('Model') && existingCharacter.Parent !== undefined) {
		existingCharacter.Destroy();
		characterData.delete(existingCharacter);
		player.Character = undefined;
		return;
	}
	
	const character = baseCharacter.Clone();
	character.Name = player.Name;
	
	const body = character.FindFirstChild('Body');
	if (!body?.IsA('Part')) {
		throw '[server::players] failed to respawn player because Body is not a Part';
	}
	
	characterData.set(character, {
		body: body,
		area: AreaManager.Area.Unknown,
		leaderstats: {
			altitude: altitudeValue,
			area: areaValue,
		},
	});
	
	// TODO: better system for billboard gui (+ make size responsive)
	const billboardGui = character.FindFirstChildWhichIsA('BillboardGui', true)!;
	billboardGui.PlayerToHideFrom = player;
	(billboardGui.FindFirstChild('DisplayName') as TextLabel).Text = player.DisplayName;
	(billboardGui.FindFirstChild('Username') as TextLabel).Text = `@${player.Name}`;
	
	character.Destroying.Once(() => {
		characterData.delete(character);
		
		if (character.GetAttribute('unloading') !== true) {
			respawn(player);
		}
	});
	
	character.Parent = Workspace;
	player.Character = character;
	body.SetNetworkOwner(player);
	
	const color = player.GetAttribute('color');
	if (typeIs(color, 'Color3')) {
		body.Color = color;
	} else {
		body.Color = computeNameColor(player.Name);
	}
}

async function onFullReset(player: Player): Promise<true> {
	await respawn(player);
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
	const character = player.Character;
	if (character !== undefined) {
		characterData.delete(character);
		character.SetAttribute('unloading', true);
		character.Destroy();
	}
	
	PlayerData.unload(player);
	
	const playerRichText = new RichText({ font: { color: player.GetAttribute('color') as Color3 } });
	Remotes.sendSystemMessage.fireAll(joinLeaveRichText.apply(playerRichText.apply(`${player.DisplayName} left the server`)));
}

function onPreSimulation(): void {
	for (const [character, data] of characterData) {
		const body = character.PrimaryPart;
		if (body === undefined) {
			continue;
		}
		
		if (body.Position.Y < -1e3) {
			characterData.delete(character);
			character.Destroy();
			continue;
		}
		
		const altitude = math.floor(math.max(Units.studsToMeters(body.Position.Y - body.Size.Y / 2), 0));
		if (data.leaderstats.altitude.Value !== altitude) {
			data.leaderstats.altitude.Value = altitude;
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
RunService.PreSimulation.Connect(onPreSimulation);
