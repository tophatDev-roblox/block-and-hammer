import { Players } from '@rbxts/services';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import GameProvider from './providers/game';
import StylesProvider from './providers/styles';
import App from './components/App';

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;

const root = ReactRoblox.createRoot(new Instance('Folder'));
root.render(
	<React.StrictMode>
		<StylesProvider>
			<GameProvider>
				{ReactRoblox.createPortal(<App />, playerGui)}
			</GameProvider>
		</StylesProvider>
	</React.StrictMode>
);
