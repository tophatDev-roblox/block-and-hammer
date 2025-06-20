import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { atom } from '@rbxts/charm';

import defaultStyles from 'client/stylesParser/default';
import { inputType } from 'client/inputType';
import { characterAtom } from 'client/character';
import { GameContext } from './context';

export const isMenuOpen = atom<boolean>(false);

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
				styles: defaultStyles,
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

