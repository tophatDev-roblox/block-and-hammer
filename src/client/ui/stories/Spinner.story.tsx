import { CreateReactStory } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import Spinner from '../components/Spinner';

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {},
}, ({ controls: {} }) => {
	return (
		<Spinner />
	);
});
