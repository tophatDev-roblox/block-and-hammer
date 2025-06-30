import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { SideMenuState } from 'client/sideMenuState';
import { usePx } from 'client/ui/hooks/usePx';
import SideButton, { InheritedProps } from '../SideButton';

interface MenuButtonProps extends InheritedProps {
	totalButtons: number;
}

const MenuButton: React.FC<MenuButtonProps> = (props) => {
	const {
		styles,
		text,
		iconId,
		index,
		focusIndex,
		totalButtons,
		widthScale = 0,
		widthOffset = 0,
		iconScale,
		padding,
		onClick = () => {},
	} = props;
	
	const [canAnimate, setCanAnimate] = useState<boolean>(false);
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	
	const px = usePx();
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0));
	
	useEffect(() => {
		if (sideMenuOpened) {
			const delay = (totalButtons - index - 1) / 30;
			
			const thread = task.delay(delay, () => {
				sizeMotion.tween(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0), {
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.Out,
					time: 0.3,
				});
			});
			
			const animateThread = task.delay(delay + 0.3, () => {
				setCanAnimate(true);
			});
			
			return () => {
				task.cancel(thread);
				task.cancel(animateThread);
			};
		} else {
			setCanAnimate(false);
			
			const thread = task.delay(index / 20, () => {
				sizeMotion.tween(new UDim2(widthScale, widthOffset, 1, 0), {
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.In,
					time: 0.3,
				});
			});
			
			return () => {
				task.cancel(thread);
			};
		}
	}, [sideMenuOpened]);
	
	return (
		<SideButton
			styles={styles}
			text={text}
			iconId={iconId}
			size={size}
			sizeMotion={sizeMotion}
			isHovered={isHovered}
			isPressed={isPressed}
			canAnimate={canAnimate}
			isFocused={focusIndex === index}
			widthOffset={widthOffset}
			widthScale={widthScale}
			iconScale={iconScale}
			padding={padding}
			onClick={onClick}
			onHover={setHovered}
			onPress={setPressed}
		/>
	);
};

export default MenuButton;
