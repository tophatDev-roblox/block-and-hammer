import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { CreateReactStory } from '@rbxts/ui-labs';

import SideMenuGUI from '../components/SideMenu';

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {},
}, ({ controls: {} }) => {
	return (
		<SideMenuGUI />
	);
});
