import { atom, Atom } from '@rbxts/charm';
import { Players } from '@rbxts/services';

import { CharacterState } from './character/state';

export namespace OtherCharacters {
	export const partsAtoms = atom<Map<Player, Atom<CharacterState.Parts | undefined>>>(new Map());
}

function onPlayerAdded(player: Player): void {
	const partsAtom = atom<CharacterState.Parts>();
	OtherCharacters.partsAtoms((parts) => table.clone(parts).set(player, partsAtom));
	
	const onCharacterAdded = async (newCharacter: Model): Promise<void> => {
		const characterParts = await CharacterState.createParts(newCharacter);
		partsAtom(characterParts);
	};
	
	const onCharacterRemoving = (): void => {
		partsAtom(undefined);
	};
	
	if (player.Character !== undefined) {
		onCharacterAdded(player.Character);
	}
	
	player.CharacterAdded.Connect(onCharacterAdded);
	player.CharacterRemoving.Connect(onCharacterRemoving);
}

function onPlayerRemoving(player: Player): void {
	OtherCharacters.partsAtoms((parts) => {
		const newParts = table.clone(parts);
		newParts.delete(player);
		return newParts;
	});
}

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.PlayerRemoving.Connect(onPlayerRemoving);
