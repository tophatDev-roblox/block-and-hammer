import { CreateReactStory } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import SideMenu from '../components/SideMenu';

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {},
}, ({ controls: {} }) => {
	return (
		<SideMenu />
	);
});
