import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import Ripple from '@rbxts/ripple';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIPadding from 'client/ui/components/UIPadding';
import Text from 'client/ui/components/Text';

interface ItemProps {
	text: string;
	onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ text, onClick }) => {
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1);
	
	const px = usePx();
	
	const settingsStyles = Styles.UI.panel.settings;
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Linear,
			time: 0.1,
		};
		
		if (isHovered) {
			if (isPressed) {
				backgroundTransparencyMotion.tween(0.7, options);
			} else {
				backgroundTransparencyMotion.tween(0.8, options);
			}
		} else {
			backgroundTransparencyMotion.tween(1, options);
		}
	}, [isHovered, isPressed]);
	
	return (
		<textbutton
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			AutoButtonColor={false}
			Event={{
				MouseEnter: () => {
					setHovered(true);
				},
				MouseLeave: () => {
					setHovered(false);
					setPressed(false);
				},
				MouseButton1Down: () => {
					setPressed(true);
				},
				MouseButton1Up: () => {
					setPressed(false);
				},
				MouseButton1Click: onClick,
			}}
		>
			<uicorner
				CornerRadius={new UDim(0, px(16 - settingsStyles.dropdown.padding))}
			/>
			<UIPadding
				padding={px(settingsStyles.dropdown.padding)}
			/>
			<Text
				styles={settingsStyles.dropdown.itemText}
				text={text}
				autoHeight
			/>
		</textbutton>
	);
};

export default Item;
