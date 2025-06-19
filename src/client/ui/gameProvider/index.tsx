import { Players, UserInputService } from '@rbxts/services';
import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { atom } from '@rbxts/charm';

import { GameContext, InputType } from './context';
import defaultStyles from 'client/stylesParser/default';

const client = Players.LocalPlayer;

const mouseInputTypes = new Set<Enum.UserInputType>([
	Enum.UserInputType.MouseMovement,
	Enum.UserInputType.MouseWheel,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
]);

export const isMenuOpen = atom<boolean>(false);

interface GameProviderProps {
	children: React.ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const [inputType, setInputType] = useState<InputType>(InputType.Desktop);
	const [cube, setCube] = useState<Model | undefined>(undefined);
	const [body, setBody] = useState<Part | undefined>(undefined);
	
	const menuOpen = useAtom(isMenuOpen);
	
	useEffect(() => {
		const onInputTypeChanged = (inputType: Enum.UserInputType) => {
			if (inputType === Enum.UserInputType.Touch) {
				setInputType(InputType.Touch);
			} else if (inputType.Value >= Enum.UserInputType.Gamepad1.Value && inputType.Value <= Enum.UserInputType.Gamepad8.Value) {
				setInputType(InputType.Controller);
			} else if (mouseInputTypes.has(inputType)) {
				setInputType(InputType.Desktop);
			}
		};
		
		onInputTypeChanged(UserInputService.GetLastInputType());
		
		const inputTypeChangedEvent = UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
		
		return () => {
			inputTypeChangedEvent.Disconnect();
		};
	}, []);
	
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
				inputType,
				cube,
				body,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;

