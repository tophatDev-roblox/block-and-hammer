import { GuiService } from '@rbxts/services';
import React, { useEffect, useRef, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Styles, StyleParse } from 'client/styles';
import { Assets } from 'shared/assets';
import { InputType } from 'client/inputType';
import { usePx } from '../hooks/usePx';
import Text from './Text';
import Gradient from './Gradient';
import Outline from './Outline';
import UIListLayout from './UIListLayout';
import UIPadding from './UIPadding';

interface SideButtonProps {
	styles: Styles.ButtonWithIcon;
	text: string;
	iconId: string;
	size: React.Binding<UDim2>;
	sizeMotion: Ripple.Motion<UDim2>;
	order: number;
	canAnimate: boolean;
	isHovered: boolean;
	isPressed: boolean;
	selectable: boolean;
	autoSelect?: boolean;
	widthScale?: number;
	widthOffset?: number;
	iconScale?: number;
	padding?: number;
	onClick?: () => void;
	onHover?: (hovered: boolean) => void;
	onPress?: (pressed: boolean) => void;
}

export interface InheritedProps {
	styles: Styles.ButtonWithIcon;
	text: string;
	iconId: string;
	index: number;
	selectable: boolean;
	autoSelect?: boolean;
	widthScale?: number;
	widthOffset?: number;
	iconScale?: number;
	padding?: number;
	onClick?: () => void;
}

const SideButton: React.FC<SideButtonProps> = (props) => {
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
		size,
		sizeMotion,
		order,
		canAnimate,
		selectable,
		autoSelect,
		isPressed,
		isHovered,
		widthScale = 0,
		widthOffset = 0,
		iconScale = 0.8,
		padding = 12,
		onClick = () => {},
		onHover = () => {},
		onPress = () => {},
	} = props;
	
	const [isFocused, setFocused] = useState<boolean>(false);
	
	const selectionImageObjectRef = useRef<Frame>();
	const buttonRef = useRef<ImageButton>();
	
	const inputType = useAtom(InputType.stateAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	const isBackgroundRGBA = StyleParse.isRGBA(background);
	const isIconBackgroundRGBA = StyleParse.isRGBA(iconBackground);
	const isIconColorRGBA = StyleParse.isRGBA(iconColor);
	const iconSize = textStyles.autoScale === false ? textStyles.size : px(textStyles.size);
	
	useEventListener(GuiService.GetPropertyChangedSignal('SelectedObject'), () => {
		if (GuiService.SelectedObject === buttonRef.current) {
			setFocused(true);
			onHover(true);
		} else {
			setFocused(false);
			onHover(false);
		}
	});
	
	useEffect(() => {
		const button = buttonRef.current;
		if (button === undefined || inputType !== InputType.Value.Controller) {
			if (inputType !== InputType.Value.Controller) {
				GuiService.SelectedObject = undefined;
			}
			
			return;
		}
		
		if (selectable) {
			if (autoSelect) {
				GuiService.SelectedObject = button;
			}
		} else if (GuiService.SelectedObject === button) {
			GuiService.SelectedObject = undefined;
		}
	}, [autoSelect, selectable, inputType]);
	
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
	}, [canAnimate, isHovered, isPressed, widthScale, widthOffset, px]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, iconSize + px(padding) * 2)}
			LayoutOrder={order}
		>
			<imagebutton
				ref={buttonRef}
				BackgroundTransparency={1}
				Size={size}
				Position={UDim2.fromScale(1, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Image={Assets.Images.ButtonBackground}
				ImageColor3={isBackgroundRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
				ImageTransparency={isBackgroundRGBA ? 1 - background.alpha : 0}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(256, 256, 256, 256)}
				SliceScale={1}
				SelectionImageObject={selectionImageObjectRef.current}
				AutoButtonColor={false}
				Event={{
					MouseEnter: () => onHover(true),
					MouseLeave: () => onHover(false),
					MouseButton1Down: () => onPress(true),
					MouseButton1Up: () => onPress(false),
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
					Size={UDim2.fromScale(1, 1)}
				>
					<frame
						ref={selectionImageObjectRef}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
						<Outline
							styles={styles.controller.selectionOutline}
							applyStrokeMode={Enum.ApplyStrokeMode.Border}
							overwriteThickness={isFocused ? undefined : 0}
							animateThickness
						/>
					</frame>
					<frame
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
						{outline !== false && (
							<Outline
								styles={outline}
								applyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
						)}
						<UIListLayout
							fillDirection={Enum.FillDirection.Horizontal}
							padding={px(padding)}
						/>
						<UIPadding
							padding={px(padding)}
						/>
						<frame
							BackgroundColor3={isIconBackgroundRGBA ? StyleParse.color(iconBackground) : Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={isIconBackgroundRGBA ? 1 - iconBackground.alpha : 0}
							BorderSizePixel={0}
							Size={UDim2.fromOffset(iconSize, iconSize)}
							LayoutOrder={0}
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
								Size={UDim2.fromScale(iconScale, iconScale)}
								Position={UDim2.fromScale(0.5, 0.5)}
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
							order={1}
							automaticWidth
							automaticHeight
						/>
					</frame>
				</frame>
			</imagebutton>
		</frame>
	);
};

export default SideButton;
