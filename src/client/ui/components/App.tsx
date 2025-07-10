import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { StartScreenState } from 'client/ui/startScreenState';

import SpeedEffectGUI from './SpeedEffect';
import StartScreenGUI from './StartScreen';
import SubtitlesGUI from './Subtitles';
import SideMenuGUI from './SideMenu';
import VersionGUI from './Version';
import TimerGUI from './Timer';
import ModalGUI from './Modal';
import HudGUI from './HUD';
import World from './World';

const App: React.FC = () => {
	const isInStartScreen = useAtom(StartScreenState.isVisibleAtom);
	if (isInStartScreen) {
		return (
			<>
				<StartScreenGUI />
				<VersionGUI />
			</>
		);
	}
	
	return (
		<>
			<World />
			<SpeedEffectGUI />
			<VersionGUI />
			<SubtitlesGUI />
			<HudGUI />
			<TimerGUI />
			<SideMenuGUI />
			<ModalGUI />
		</>
	);
};

export default App;
