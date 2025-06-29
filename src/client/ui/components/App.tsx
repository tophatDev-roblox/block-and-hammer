import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { StartScreenState } from 'client/startScreenState';
import StartScreen from './StartScreen';
import SpeedEffect from './SpeedEffect';
import Version from './Version';
import HUD from './HUD';
import Timer from './Timer';
import SideMenu from './SideMenu';

const App: React.FC = () => {
	const isInStartScreen = useAtom(StartScreenState.isVisibleAtom);
	if (isInStartScreen) {
		return (
			<>
				<StartScreen />
				<Version />
			</>
		);
	}
	
	return (
		<>
			<SpeedEffect />
			<Version />
			<HUD />
			<Timer />
			<SideMenu />
		</>
	);
};

export default App;
