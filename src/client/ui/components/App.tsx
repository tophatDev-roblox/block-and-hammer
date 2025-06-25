import React from '@rbxts/react';

import GameProvider from '../providers/game';
import HUD from './HUD';
import Timer from './Timer';
import SpeedEffect from './SpeedEffect';
import Version from './Version';

const App: React.FC = () => {
	return (
		<GameProvider>
			<HUD />
			<Timer />
			<SpeedEffect />
			<Version />
		</GameProvider>
	);
};

export default App;
