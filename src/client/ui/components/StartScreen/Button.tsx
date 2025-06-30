import React, { useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { usePx } from 'client/ui/hooks/usePx';
import SideButton, { InheritedProps } from '../SideButton';

const Button: React.FC<InheritedProps> = (props) => {
	const {
		styles,
		text,
		iconId,
		index,
		focusIndex,
		widthScale = 0,
		widthOffset = 0,
		iconScale,
		padding,
		onClick = () => {},
	} = props;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const px = usePx();
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0));
	
	return (
		<SideButton
			styles={styles}
			text={text}
			iconId={iconId}
			size={size}
			sizeMotion={sizeMotion}
			isHovered={isHovered}
			isPressed={isPressed}
			isFocused={focusIndex === index}
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
