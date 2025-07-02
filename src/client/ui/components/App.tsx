import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { StartScreenState } from 'client/ui/startScreenState';
import World from './World';
import StartScreen from './StartScreen';
import SpeedEffectGUI from './SpeedEffect';
import VersionGUI from './Version';
import HudGUI from './HUD';
import TimerGUI from './Timer';
import ModalGUI from './Modal';
import SideMenuGUI from './SideMenu';

const App: React.FC = () => {
	const isInStartScreen = useAtom(StartScreenState.isVisibleAtom);
	if (isInStartScreen) {
		return (
			<>
				<StartScreen />
				<VersionGUI />
			</>
		);
	}
	
	return (
		<>
		<World />
			<SpeedEffectGUI />
			<VersionGUI />
			<HudGUI />
			<TimerGUI />
			<SideMenuGUI />
			<ModalGUI />
		</>
	);
};

export default App;
