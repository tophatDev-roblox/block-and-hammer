import React from '@rbxts/react';

import HUD from './HUD';
import Timer from './Timer';
import SpeedEffect from './SpeedEffect';
import Version from './Version';

const App: React.FC = () => {
	return (
		<>
			<SpeedEffect />
			<HUD />
			<Timer />
			<Version />
		</>
	);
};

export default App;
