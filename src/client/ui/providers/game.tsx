import React, { createContext, useContext } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { atom } from '@rbxts/charm';

import { InputType, inputType } from 'client/inputType';
import { characterAtom, CharacterParts } from 'client/character';

export const isMenuOpen = atom<boolean>(false);

interface GameContextValue {
	menuOpen: boolean;
	inputType: InputType;
	character?: CharacterParts;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);

export function useGameContext(): GameContextValue {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw '[client::providers/game] useGameContext must be used in a GameProvider';
	}
	
	return context;
}

interface GameProviderProps {
	children: React.ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const inputTypeValue = useAtom(inputType);
	const menuOpen = useAtom(isMenuOpen);
	const characterParts = useAtom(characterAtom);
	
	return (
		<GameContext.Provider
			value={{
				menuOpen,
				inputType: inputTypeValue,
				character: characterParts,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
