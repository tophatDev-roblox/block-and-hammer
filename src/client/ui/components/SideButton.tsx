import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Assets } from 'shared/assets';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from './UIListLayout';
import UIPadding from './UIPadding';
import UIGradient from './UIGradient';
import Button from './Button';
import Text from './Text';

interface SideButtonProps {
	text: string | React.Binding<string>;
	icon: string | React.Binding<string>;
	iconScale?: number | React.Binding<number>;
	onClick?: () => void;
}

const SideButton: React.FC<SideButtonProps> = ({ text, icon, iconScale = 0.7, onClick }) => {
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromOffset(0, 0));
	
	const px = usePx();
	
	useEffect(() => {
		if (isHovered) {
			if (isPressed) {
				positionMotion.tween(UDim2.fromOffset(px(-10), 0), {
					style: Enum.EasingStyle.Sine,
					direction: Enum.EasingDirection.In,
					time: 0.1,
				});
			} else {
				positionMotion.tween(UDim2.fromOffset(px(-30), 0), {
					style: Enum.EasingStyle.Elastic,
					direction: Enum.EasingDirection.Out,
					time: 0.6,
				});
			}
		} else {
			positionMotion.tween(UDim2.fromOffset(0, 0), {
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.Out,
				time: 0.25,
			});
		}
	}, [isHovered, isPressed]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, px(Styles.UI.sideButton.text.size + Styles.UI.sideButton.padding * 2))}
		>
			<Button
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Position={position}
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
				<imagelabel
					{...Styles.applyImageColorProps(Styles.UI.sideButton.background)}
					Size={UDim2.fromScale(1, 1)}
					Image={Assets.Images.ButtonBackground}
					ScaleType={Enum.ScaleType.Slice}
					SliceCenter={new Rect(256, 256, 512, 256)}
				>
					{Styles.UI.sideButton.background.type === 'gradient' && (
						<UIGradient
							styles={Styles.UI.sideButton.background}
						/>
					)}
					<UIListLayout
						fillDirection={Enum.FillDirection.Horizontal}
						alignX={Enum.HorizontalAlignment.Left}
						gap={px(Styles.UI.sideButton.padding)}
					/>
					<UIPadding
						padding={px(Styles.UI.sideButton.padding)}
					/>
					<frame
						{...Styles.applyBackgroundColorProps(Styles.UI.sideButton.icon.background)}
						Size={UDim2.fromScale(1, 1)}
						SizeConstraint={Enum.SizeConstraint.RelativeYY}
						LayoutOrder={0}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
						{Styles.UI.sideButton.icon.background.type === 'gradient' && (
							<UIGradient
								styles={Styles.UI.sideButton.icon.background}
							/>
						)}
						<imagelabel
							{...Styles.applyImageColorProps(Styles.UI.sideButton.icon.color)}
							BackgroundTransparency={1}
							Size={typeIs(iconScale, 'number')
								? UDim2.fromScale(iconScale, iconScale)
								: iconScale.map((iconScale) => UDim2.fromScale(iconScale, iconScale))}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Image={icon}
						/>
					</frame>
					<Text
						styles={Styles.UI.sideButton.text}
						text={text}
						autoWidth
						order={1}
					/>
				</imagelabel>
			</Button>
		</frame>
	);
};

export default SideButton;
