import { Players } from '@rbxts/services';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { atom } from '@rbxts/charm';

import App from './components/App';

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;

export const isMenuOpenAtom = atom<boolean>(false);

const root = ReactRoblox.createRoot(new Instance('Folder'));
root.render(
	<React.StrictMode>
		{ReactRoblox.createPortal(<App />, playerGui)}
	</React.StrictMode>
);
