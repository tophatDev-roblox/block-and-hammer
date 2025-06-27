import { Players } from '@rbxts/services';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import App from './components/App';

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;

const root = ReactRoblox.createRoot(new Instance('Folder'));
root.render(
	<React.StrictMode>
		{ReactRoblox.createPortal(<App />, playerGui)}
	</React.StrictMode>
);
