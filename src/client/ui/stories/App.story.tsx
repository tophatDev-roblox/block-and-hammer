import { ReplicatedStorage, Workspace } from '@rbxts/services';
import { CreateReactStory } from '@rbxts/ui-labs';
import React, { useEffect, useState } from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { InputType } from 'client/inputType';
import { GameContext } from 'client/ui/providers/game';
import { StylesContext } from 'client/ui/providers/styles';
import defaultStyles from 'client/stylesParser/default';
import App from 'client/ui/components/App';

const Main: React.FC = () => {
	const [cube, setCube] = useState<Model | undefined>(undefined);
	const [body, setBody] = useState<Part | undefined>(undefined);
	
	useEffect(() => {
		const baseCharacter = ReplicatedStorage?.FindFirstChild('Assets')?.FindFirstChild('BaseCharacter') as Model | undefined;
		if (baseCharacter === undefined) {
			warn('[client::stories/App] failed to find ReplicatedStorage.Assets.BaseCharacter');
			return;
		}
		
		const character = baseCharacter.Clone();
		character.Archivable = false;
		character.Name = 'UI_Preview';
		character.SetAttribute('startTime', os.clock());
		
		const billboardGui = character.FindFirstChild('BillboardGui') as BillboardGui;
		(billboardGui.FindFirstChild('Username') as TextLabel).Text = '@UI_Preview';
		(billboardGui.FindFirstChild('DisplayName') as TextLabel).Text = 'TestCharacter';
		
		character.Parent = Workspace;
		
		setCube(character);
		setBody(character.FindFirstChild('Body') as Part | undefined);
		
		return () => {
			character.Destroy();
			setCube(undefined);
			setBody(undefined);
		};
	}, []);
	
	return (
		<StylesContext.Provider
			value={{ styles: defaultStyles }}
		>
			<GameContext.Provider
				value={{
					menuOpen: false,
					inputType: InputType.Desktop,
					body: body,
					cube: cube,
				}}
			>
				<App />
			</GameContext.Provider>
		</StylesContext.Provider>
	);
};

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {},
}, ({ controls: {} }) => {
	return (
		<Main />
	);
});
