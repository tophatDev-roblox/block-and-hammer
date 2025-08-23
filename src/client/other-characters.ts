import { Players } from '@rbxts/services';

import Immut from '@rbxts/immut';

import { Atom, atom, peek, subscribe } from '@rbxts/charm';

import { UserSettings } from 'shared/user-settings';
import { InputType } from 'shared/input-type';

import { ClientSettings } from 'client/client-settings';

import { CharacterState } from 'client/character/state';

const client = Players.LocalPlayer;
const characterModels = new Map<Player, { parts: CharacterState.Parts, isTransparentAtom: Atom<boolean> }>();

export namespace OtherCharacters {
	export const partsAtoms = atom<ReadonlyMap<Player, { partsAtom: Atom<CharacterState.Parts | undefined>, inputTypeAtom: Atom<InputType> }>>(new Map());
}

function setCharacterTransparency(characterParts: CharacterState.Parts, transparency: number): void {
	characterParts.body.SetAttribute('hideOthersTransparency', transparency);
	
	// TODO: make hammer trail transparent too
	characterParts.body.LocalTransparencyModifier = transparency;
	characterParts.face.LocalTransparencyModifier = transparency;
	characterParts.hammer.head.LocalTransparencyModifier = transparency;
	characterParts.hammer.handle.LocalTransparencyModifier = transparency;
}

function onPlayerAdded(player: Player): void {
	const partsAtom = atom<CharacterState.Parts>();
	const inputTypeAtom = atom<InputType>(InputType.Unknown);
	
	OtherCharacters.partsAtoms((parts) => Immut.produce(parts, (draft) => {
		draft.set(player, { partsAtom, inputTypeAtom });
	}));
	
	const onCharacterAdded = async (newCharacter: Model): Promise<void> => {
		const characterParts = await CharacterState.createParts(newCharacter);
		
		if (player.UserId !== client.UserId) {
			characterModels.set(player, { parts: characterParts, isTransparentAtom: atom(false) });
			
			const userSettings = peek(ClientSettings.stateAtom);
			const hideOthers = userSettings.general.hideOthers;
			
			if (hideOthers === UserSettings.HideOthers.Always || (hideOthers === UserSettings.HideOthers.NonFriends && !client.IsFriendsWith(player.UserId))) {
				setCharacterTransparency(characterParts, 1);
			}
		}
		
		partsAtom(characterParts);
	};
	
	const onCharacterRemoving = (): void => {
		characterModels.delete(player);
		
		partsAtom(undefined);
	};
	
	const onAttributeChanged = (): void => {
		const inputType = (player.GetAttribute('inputType') ?? InputType.Unknown) as InputType;
		
		inputTypeAtom(inputType);
	};
	
	if (player.Character !== undefined) {
		onCharacterAdded(player.Character);
	}
	
	onAttributeChanged();
	
	player.CharacterAdded.Connect(onCharacterAdded);
	player.CharacterRemoving.Connect(onCharacterRemoving);
	player.AttributeChanged.Connect(onAttributeChanged);
}

function onPlayerRemoving(player: Player): void {
	characterModels.delete(player);
	
	OtherCharacters.partsAtoms((parts) => Immut.produce(parts, (draft) => {
		draft.delete(player);
	}));
}

subscribe(() => ClientSettings.stateAtom().general.hideOthers, (hideOthers) => {
	(async () => {
		for (const [player, { parts: otherParts }] of characterModels) {
			switch (hideOthers) {
				case UserSettings.HideOthers.Always: {
					setCharacterTransparency(otherParts, 1);
					break;
				}
				case UserSettings.HideOthers.Never: {
					setCharacterTransparency(otherParts, 0);
					break;
				}
				case UserSettings.HideOthers.NonFriends: {
					setCharacterTransparency(otherParts, client.IsFriendsWith(player.UserId) ? 0 : 1);
					break;
				}
			}
		}
	})();
});

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
