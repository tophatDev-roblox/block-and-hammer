import React from '@rbxts/react';

import SpeedEffect from './SpeedEffect';
import Version from './Version';
import HUD from './HUD';
import Timer from './Timer';
import SideMenu from './SideMenu';

const App: React.FC = () => {
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
