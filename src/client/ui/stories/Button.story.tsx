import { CreateReactStory, Slider } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import defaultStyles from 'client/styles/default';
import Button from '../components/Button';

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {
		iconId: '79239443855874',
		iconScale: Slider(0.8, 0, 2, 0.1),
		text: 'Hello World',
	},
}, ({ controls: { iconId, iconScale, text } }) => {
	return (
		<Button
			styles={defaultStyles.buttons.sideMenu}
			text={text}
			iconId={iconId}
			iconScale={iconScale}
		/>
	);
});
