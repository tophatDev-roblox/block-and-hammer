import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { UI } from 'client/ui/state';

import StartScreen from './StartScreen';
import Transition from './Transition';
import SideMenu from './SideMenu';
import Version from './Version';
import HUD from './HUD';

const App: React.FC = () => {
	const state = useAtom(UI.stateAtom);
	
	if (state === UI.State.StartScreen) {
		return (
			<>
				<Transition
					key={'Transition'}
				/>
				<Version
					key={'Version'}
				/>
				<StartScreen
					key={'StartScreen'}
				/>
			</>
		);
	}
	
	return (
		<>
			<Transition
				key={'Transition'}
			/>
			<Version
				key={'Version'}
			/>
			<HUD
				key={'HUD'}
			/>
			<SideMenu
				key={'SideMenu'}
			/>
		</>
	);
};

export default App;
