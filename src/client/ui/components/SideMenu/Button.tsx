import { UserInputService } from '@rbxts/services';
import React, { useEffect, useRef, useState } from '@rbxts/react';
import { useEventListener, useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Styles, StyleParse } from 'client/styles';
import { Controller } from 'shared/controller';
import { SideMenuState } from 'client/sideMenu';
import { InputType } from 'client/inputType';
import { usePx } from '../../hooks/usePx';
import Text from '../Text';
import Gradient from '../Gradient';
import Outline from '../Outline';

interface ButtonProps {
	styles: Styles.Button;
	text: string;
	iconId: string;
	index: number;
	focusIndex?: number;
	totalButtons: number;
	widthScale?: number;
	widthOffset?: number;
	iconScale?: number;
	padding?: number;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {
	const {
		styles: {
			text: textStyles,
			icon: {
				background: iconBackground,
				color: iconColor,
			},
			background,
			outline,
		},
		text,
		iconId,
		focusIndex,
		index,
		totalButtons,
		widthScale = 0,
		widthOffset = 0,
		iconScale = 0.8,
		padding = 12,
		onClick = () => {},
	} = props;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	const [canAnimate, setCanAnimate] = useState<boolean>(false);
	
	const wasFocusedRef = useRef<boolean>(focusIndex === index);
	
	const inputType = useAtom(InputType.stateAtom);
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0));
	
	const isBackgroundRGBA = 'red' in background;
	const isIconBackgroundRGBA = 'red' in iconBackground;
	const isIconColorRGBA = 'red' in iconColor;
	const iconSize = textStyles.autoScale === false ? textStyles.size : px(textStyles.size);
	
	useEventListener(UserInputService.InputBegan, (input, processed) => {
		if (processed || inputType !== InputType.Value.Controller) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationSelect && isHovered) {
			setPressed(true);
		}
	});
	
	useEventListener(UserInputService.InputEnded, (input) => {
		if (inputType !== InputType.Value.Controller) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationSelect && isPressed) {
			setPressed(false);
			
			if (index === focusIndex) {
				onClick();
			}
		}
	});
	
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
	
	useEffect(() => {
		if (inputType !== InputType.Value.Controller) {
			setHovered(false);
			return;
		}
		
		const isFocused = focusIndex === index;
		const wasFocused = wasFocusedRef.current;
		if (isFocused && !wasFocused) {
			setHovered(true);
		} else if (!isFocused && wasFocused) {
			setHovered(false);
		}
		
		wasFocusedRef.current = isFocused
	}, [focusIndex, index]);
	
	useEffect(() => {
		if (!canAnimate) {
			return;
		}
		
		if (isPressed) {
			sizeMotion.tween(new UDim2(1 + widthScale, px(-15) + widthOffset, 1, 0), {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.Out,
				time: 0.1,
			});
		} else {
			if (isHovered) {
				sizeMotion.tween(new UDim2(1 + widthScale, widthOffset, 1, 0), {
					style: Enum.EasingStyle.Elastic,
					direction: Enum.EasingDirection.Out,
					time: 0.8,
				});
			} else {
				sizeMotion.tween(new UDim2(1 + widthScale, px(-30) + widthOffset, 1, 0), {
					style: Enum.EasingStyle.Sine,
					direction: Enum.EasingDirection.Out,
					time: 0.2,
				});
			}
		}
	}, [canAnimate, isHovered, isPressed]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, iconSize + px(padding) * 2)}
		>
			<imagebutton
				BackgroundTransparency={1}
				Size={size}
				Position={new UDim2(1, 0, 0, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Image={'rbxassetid://116917521691205'}
				ImageColor3={isBackgroundRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
				ImageTransparency={isBackgroundRGBA ? 1 - background.alpha : 0}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(256, 256, 256, 256)}
				SliceScale={1}
				AutoButtonColor={false}
				Selectable={false}
				Event={{
					MouseEnter: () => setHovered(true),
					MouseLeave: () => setHovered(false),
					MouseButton1Down: () => setPressed(true),
					MouseButton1Up: () => setPressed(false),
					MouseButton1Click: () => onClick(),
				}}
			>
				{!isBackgroundRGBA && (
					<Gradient
						styles={background}
					/>
				)}
				<frame
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
				>
					{outline !== false && (
						<Outline
							styles={outline}
							applyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
					)}
					{inputType === InputType.Value.Controller && (
						<Outline
							styles={styles.controller.selectionOutline}
							applyStrokeMode={Enum.ApplyStrokeMode.Border}
							overwriteThickness={focusIndex === index ? undefined : 0}
						/>
					)}
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0, px(padding))}
					/>
					<uipadding
						PaddingTop={new UDim(0, px(padding))}
						PaddingRight={new UDim(0, px(padding))}
						PaddingBottom={new UDim(0, px(padding))}
						PaddingLeft={new UDim(0, px(padding))}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
					<frame
						BackgroundColor3={isIconBackgroundRGBA ? StyleParse.color(iconBackground) : Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={isIconBackgroundRGBA ? 1 - iconBackground.alpha : 0}
						BorderSizePixel={0}
						Size={new UDim2(0, iconSize, 0, iconSize)}
					>
						{!isIconBackgroundRGBA && (
							<Gradient
								styles={iconBackground}
							/>
						)}
						<uiaspectratioconstraint
							AspectRatio={1}
						/>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
						<imagelabel
							BackgroundTransparency={1}
							Size={new UDim2(iconScale, 0, iconScale, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Image={iconId}
							ImageColor3={isIconColorRGBA ? StyleParse.color(iconColor) : Color3.fromRGB(255, 255, 255)}
							ImageTransparency={isIconColorRGBA ? 1 - iconColor.alpha : 0}
						>
							{!isIconColorRGBA && (
								<Gradient
									styles={iconColor}
								/>
							)}
						</imagelabel>
					</frame>
					<Text
						styles={textStyles}
						text={text}
						automaticWidth
						automaticHeight
					/>
				</frame>
			</imagebutton>
		</frame>
	);
};

export default Button;
