import { Players } from '@rbxts/services';

import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { waitForChild } from 'shared/waitForChild';

import App from './components/App';

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
