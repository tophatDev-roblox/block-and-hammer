import { Players } from '@rbxts/services';
import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { atom } from '@rbxts/charm';

import { GameContext } from './context';
import defaultStyles from 'client/stylesParser/default';

const client = Players.LocalPlayer;

export const isMenuOpen = atom<boolean>(false);

interface GameProviderProps {
	children: React.ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const [cube, setCube] = useState<Model | undefined>(undefined);
	const [body, setBody] = useState<Part | undefined>(undefined);
	
	const menuOpen = useAtom(isMenuOpen);
	
	useEffect(() => {
		const onCharacterAdded = (character: Model) => {
			setCube(character);
			setBody(character.WaitForChild('Body') as Part);
		};
		
		const onCharacterRemoving = () => {
			setCube(undefined);
			setBody(undefined);
		};
		
		if (client.Character !== undefined) {
			task.spawn(onCharacterAdded, client.Character);
		}
		
		const characterAddedEvent = client.CharacterAdded.Connect(onCharacterAdded);
		const characterRemovingEvent = client.CharacterRemoving.Connect(onCharacterRemoving);
		
		return () => {
			characterAddedEvent.Disconnect();
			characterRemovingEvent.Disconnect();
		};
	}, []);
	
	return (
		<GameContext.Provider
			value={{
				styles: defaultStyles,
				menuOpen,
				cube,
				body,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;

