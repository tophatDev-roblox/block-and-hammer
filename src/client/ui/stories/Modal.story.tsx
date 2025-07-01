import { CreateReactStory } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import Modal from '../components/Modal/Modal';

export = CreateReactStory({
	react: React,
	reactRoblox: ReactRoblox,
	controls: {
		title: 'Title',
		body: 'Are you sure?',
		dismissable: true,
		button1: 'A',
		button2: 'B',
		button3: '',
	},
}, ({ controls: { title, body, dismissable, button1, button2, button3 } }) => {
	return (
		<Modal
			title={title}
			body={body}
			dismissable={dismissable}
			actions={button3.size() > 0 ? [button1, button2, button3] : button2.size() > 0 ? [button1, button2] : button1.size() > 0 ? [button1] : []}
		/>
	);
});
