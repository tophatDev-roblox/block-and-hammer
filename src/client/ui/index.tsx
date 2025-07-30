import { Players } from '@rbxts/services';

import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { waitForChild } from 'shared/wait-for-child';

import App from './components/App';

import './side-menu';
import './panel';

const client = Players.LocalPlayer;

(async () => {
	const playerGui = await waitForChild(client, 'PlayerGui', 'PlayerGui');
	
	const root = ReactRoblox.createRoot(new Instance('Folder'));
	root.render(
		<React.StrictMode>
			{ReactRoblox.createPortal(<App />, playerGui)}
		</React.StrictMode>
	);
})();
