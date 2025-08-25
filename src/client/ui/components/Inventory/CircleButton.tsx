import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIPadding from '../UIPadding';
import Button from '../Button';
import Ripple from '@rbxts/ripple';

interface CircleButtonProps {
	icon: string;
	onClick: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ icon, onClick }) => {
	const buttonStyles = Styles.UI.inventory.buttons;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	
	const px = usePx();
	
	const [backgroundColor, backgroundColorMotion] = useMotion<Color3>(buttonStyles.background.color);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1 - buttonStyles.background.alpha);
	
	const buttonSize = px(buttonStyles.button.size);
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Linear,
			time: 0.2,
		};
		
		let targetColor: Styles.Color;
		
		if (isHovered) {
			targetColor = buttonStyles.hoveredBackground;
		} else {
			targetColor = buttonStyles.background;
		}
		
		backgroundColorMotion.tween(targetColor.color, options);
		backgroundTransparencyMotion.tween(1 - targetColor.alpha, options);
	}, [isHovered]);
	
	return (
		<Button
			BackgroundColor3={backgroundColor}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromOffset(buttonSize, buttonSize)}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Click: () => onClick(),
			}}
		>
			<uicorner
				CornerRadius={new UDim(1, 0)}
			/>
			<UIPadding
				padding={px(buttonStyles.button.padding)}
			/>
			<imagelabel
				{...Styles.applyImageColorProps(buttonStyles.button.icon.color)}
				Image={icon}
				Size={UDim2.fromScale(1, 1)}
			/>
		</Button>
	);
};

export default CircleButton;
