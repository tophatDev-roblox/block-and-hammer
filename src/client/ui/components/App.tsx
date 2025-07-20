import React, { useMemo } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { PathState } from 'client/ui/path-state';

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
	const path = useAtom(PathState.valueAtom);
	
	const isInStartScreen = useMemo(() => PathState.isAt(PathState.Location.StartScreen, path), [path]);
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
