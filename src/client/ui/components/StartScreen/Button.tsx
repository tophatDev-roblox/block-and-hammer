import React, { useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { usePx } from 'client/ui/hooks/usePx';
import { StartScreenState } from 'client/startScreenState';
import SideButton, { InheritedProps } from '../SideButton';

const Button: React.FC<InheritedProps> = (props) => {
	const {
		styles,
		text,
		iconId,
		index,
		autoSelect,
		selectable,
		widthScale = 0,
		widthOffset = 0,
		iconScale,
		padding,
		onClick = () => {},
	} = props;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const isInStartScreen = useAtom(StartScreenState.isVisibleAtom);
	
	const px = usePx();
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0));
	
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
			selectable={selectable}
			autoSelect={isInStartScreen && autoSelect}
			widthOffset={widthOffset}
			widthScale={widthScale}
			iconScale={iconScale}
			padding={padding}
			onClick={onClick}
			onHover={setHovered}
			onPress={setPressed}
			canAnimate
		/>
	);
};

export default Button;
