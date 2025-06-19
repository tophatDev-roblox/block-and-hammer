import { createContext, useContext } from '@rbxts/react';
import { InputType } from 'client/inputType';

import { StylesData } from 'client/stylesParser';
import defaultStyles from 'client/stylesParser/default';

interface GameContextType {
	styles: StylesData;
	menuOpen: boolean;
	inputType: InputType;
	cube?: Model;
	body?: Part;
}

export const GameContext = createContext<GameContextType>({
	styles: defaultStyles,
	menuOpen: false,
	inputType: InputType.Desktop,
});

export const useGameContext = (): GameContextType => {
	const context = useContext(GameContext);
	if (!context) {
		throw 'useGameContext must be used in a GameProvider';
	}
	
	return context;
}
