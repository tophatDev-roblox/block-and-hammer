import { Players } from '@rbxts/services';

import Immut from '@rbxts/immut';

import { atom, Atom } from '@rbxts/charm';

import { InputType } from 'shared/input-type';

import { CharacterState } from 'client/character/state';

export namespace OtherCharacters {
	export const partsAtoms = atom<ReadonlyMap<Player, [Atom<CharacterState.Parts | undefined>, Atom<InputType>]>>(new Map());
}

function onPlayerAdded(player: Player): void {
	const partsAtom = atom<CharacterState.Parts>();
	const inputTypeAtom = atom<InputType>(InputType.Unknown);
	
	OtherCharacters.partsAtoms((parts) => Immut.produce(parts, (draft) => {
		draft.set(player, [partsAtom, inputTypeAtom]);
	}));
	
	const onCharacterAdded = async (newCharacter: Model): Promise<void> => {
		const characterParts = await CharacterState.createParts(newCharacter);
		partsAtom(characterParts);
	};
	
	const onCharacterRemoving = (): void => {
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
	OtherCharacters.partsAtoms((parts) => Immut.produce(parts, (draft) => {
		draft.delete(player);
	}));
}

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
