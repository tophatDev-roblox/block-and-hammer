import React from '@rbxts/react';

import HUD from './HUD';
import Timer from './Timer';
import Version from './Version';

const App: React.FC = () => {
	return (
		<>
			<HUD />
			<Timer />
			<Version />
		</>
	);
};

export default App;
