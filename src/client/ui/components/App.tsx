import React from '@rbxts/react';

import ErrorBoundary from './ErrorBoundary';
import Fallback from './Fallback';
import SpeedEffect from './SpeedEffect';
import Version from './Version';
import HUD from './HUD';
import Timer from './Timer';
import SideMenu from './SideMenu';

const App: React.FC = () => {
	return (
		<ErrorBoundary
			fallback={(err) => (
				<Fallback
					err={err}
				/>
			)}
		>
			<SpeedEffect />
			<Version />
			<HUD />
			<Timer />
			<SideMenu />
		</ErrorBoundary>
	);
};

export default App;
