import React, { useMemo } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { LocationState } from 'client/ui/location-state';

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
	const path = useAtom(LocationState.pathAtom);
	
	const isInStartScreen = useMemo(() => LocationState.isAt('/start-screen', path), [path]);
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
