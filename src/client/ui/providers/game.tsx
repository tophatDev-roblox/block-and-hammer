import React, { createContext, useContext, useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { atom } from '@rbxts/charm';

import { InputType, inputType } from 'client/inputType';
import { characterAtom } from 'client/character';

export const isMenuOpen = atom<boolean>(false);

interface GameContextValue {
	menuOpen: boolean;
	inputType: InputType;
	cube?: Model;
	body?: Part;
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
	const [body, setBody] = useState<Part | undefined>(undefined);
	
	const inputTypeValue = useAtom(inputType);
	const menuOpen = useAtom(isMenuOpen);
	const cube = useAtom(characterAtom);
	
	useEffect(() => {
		if (cube !== undefined) {
			setBody(cube.WaitForChild('Body') as Part);
		} else {
			setBody(undefined);
		}
	}, [cube]);
	
	return (
		<GameContext.Provider
			value={{
				menuOpen,
				inputType: inputTypeValue,
				cube,
				body,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
