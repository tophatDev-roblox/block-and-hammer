import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import Ripple from '@rbxts/ripple';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIPadding from '../../UIPadding';
import OriginalButton from '../../Button';

interface ButtonProps {
	icon: string;
	onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ icon, onClick }) => {
	const componentStyles = Styles.UI.inventory.buttons.button;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	
	const [backgroundColor, backgroundColorMotion] = useMotion<Color3>(componentStyles.background.color);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1 - componentStyles.background.alpha);
	
	const px = usePx();
	
	useEffect(() => {
		const props: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.Out,
			time: 0.2,
		};
		
		let color: Styles.Color;
		
		if (isHovered) {
			color = componentStyles.backgroundHover;
		} else {
			color = componentStyles.background;
		}
		
		backgroundColorMotion.tween(color.color, props);
		backgroundTransparencyMotion.tween(1 - color.alpha, props);
	}, [isHovered]);
	
	return (
		<OriginalButton
			BackgroundColor3={backgroundColor}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromOffset(px(64), px(64))}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Click: () => onClick(),
			}}
		>
			<UIPadding
				padding={px(componentStyles.padding)}
			/>
			<uicorner
				CornerRadius={new UDim(1, 0)}
			/>
			<imagelabel
				{...Styles.applyImageColorProps(componentStyles.image)}
				Size={UDim2.fromScale(1, 1)}
				Image={icon}
			/>
		</OriginalButton>
	);
};

export default Button;
