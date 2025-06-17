import { createContext, useContext } from '@rbxts/react';

import { StylesData } from 'client/stylesParser';
import defaultStyles from 'client/stylesParser/default';

interface GameContextType {
	styles: StylesData;
	cube: Model | undefined;
	body: Part | undefined;
}

export const GameContext = createContext<GameContextType>({
	styles: defaultStyles,
	cube: undefined,
	body: undefined,
});

export const useGameContext = (): GameContextType => {
	const context = useContext(GameContext);
	if (!context) {
		throw 'useGameContext must be used in a GameProvider';
	}
	
	return context;
}
