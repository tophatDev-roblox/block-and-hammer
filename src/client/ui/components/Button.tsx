import { SoundService } from '@rbxts/services';

import React, { useEffect, useRef } from '@rbxts/react';

import { waitForChild } from 'shared/wait-for-child';

let uiHoverSound: Sound;
let uiClickSound: Sound;

(async () => {
	uiHoverSound = await waitForChild(SoundService, 'UIHover', 'Sound');
	uiClickSound = await waitForChild(SoundService, 'UIClick', 'Sound');
})();

const Button: React.FC<React.InstanceProps<TextButton>> = (props) => {
	const buttonRef = useRef<TextButton>();
	// cant use `Event` prop because it might be used in props
	
	useEffect(() => {
		const button = buttonRef.current;
		
		if (button === undefined) {
			return;
		}
		
		const mouseEnterEvent = button.MouseEnter.Connect(() => {
			uiHoverSound.Play();
		});
		
		const mouseButton1ClickEvent = button.MouseButton1Click.Connect(() => {
			uiClickSound.Play();
		});
		
		return () => {
			mouseEnterEvent.Disconnect();
			mouseButton1ClickEvent.Disconnect();
		};
	}, []);
	
	return (
		<textbutton
			ref={buttonRef}
			Text={''}
			TextTransparency={1}
			BorderSizePixel={0}
			AutoButtonColor={false}
			{...props}
		/>
	);
};

export default Button;
