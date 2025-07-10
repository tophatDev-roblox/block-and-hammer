import { GuiService } from '@rbxts/services';
import React, { useEffect, useState } from '@rbxts/react';
import { useEventListener, useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';
import { setTimeout } from '@rbxts/set-timeout';

import { InputType } from 'shared/inputType';
import { SideMenuState } from 'client/ui/sideMenuState';
import { usePx } from 'client/ui/hooks/usePx';
import { clientInputTypeAtom } from 'client/input';
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
		selectable,
		autoSelect,
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
	const inputType = useAtom(clientInputTypeAtom);
	
	const px = usePx();
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0));
	
	useEventListener(GuiService.GetPropertyChangedSignal('SelectedObject'), () => {
		if (inputType !== InputType.Controller) {
			return;
		}
		
		if (GuiService.SelectedObject === undefined) {
			SideMenuState.isOpenAtom(false);
		}
	});
	
	useEffect(() => {
		const openSize = new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0);
		const closeSize = new UDim2(widthScale, widthOffset, 1, 0);
		if (!GuiService.ReducedMotionEnabled) {
			if (sideMenuOpened) {
				const delay = (totalButtons - index - 1) / 30;
				
				const clearTimeout = setTimeout(() => {
					sizeMotion.tween(openSize, {
						style: Enum.EasingStyle.Back,
						direction: Enum.EasingDirection.Out,
						time: 0.3,
					});
				}, delay);
				
				const clearAnimateTimeout = setTimeout(() => {
					setCanAnimate(true);
				}, delay + 0.3);
				
				return () => {
					clearTimeout();
					clearAnimateTimeout();
				};
			} else {
				setCanAnimate(false);
				
				const clearTimeout = setTimeout(() => {
					sizeMotion.tween(closeSize, {
						style: Enum.EasingStyle.Back,
						direction: Enum.EasingDirection.In,
						time: 0.3,
					});
				}, index / 20);
				
				return () => {
					clearTimeout();
				};
			}
		} else {
			if (sideMenuOpened) {
				sizeMotion.immediate(openSize);
				setCanAnimate(true);
			} else {
				sizeMotion.immediate(closeSize);
				setCanAnimate(false);
			}
		}
	}, [sideMenuOpened]);
	
	return (
		<SideButton
			styles={styles}
			text={text}
			iconId={iconId}
			size={size}
			sizeMotion={sizeMotion}
			order={index}
			isHovered={isHovered}
			isPressed={isPressed}
			canAnimate={canAnimate}
			selectable={selectable}
			autoSelect={sideMenuOpened && autoSelect}
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
