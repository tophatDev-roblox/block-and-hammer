import { TweenService } from '@rbxts/services';
import React, { useCallback, useRef } from '@rbxts/react';

import { Styles, StyleParse } from 'client/stylesParser';
import { usePx } from '../hooks/usePx';
import Text from './Text';
import Gradient from './Gradient';
import Outline from './Outline';

interface ButtonProps {
	styles: Styles.Button;
	text: string;
	iconId: string;
	iconScale?: number;
	padding?: number;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ styles, text, iconId, iconScale = 0.8, padding = 12, onClick = () => {} }) => {
	const {
		text: textStyles,
		icon: {
			background: iconBackground,
			color: iconColor,
		},
		background,
		outline,
	} = styles;
	
	const buttonRef = useRef<ImageButton>();
	const tweenRef = useRef<Tween>();
	
	const px = usePx();
	
	const isBackgroundRGBA = 'red' in background;
	const isIconBackgroundRGBA = 'red' in iconBackground;
	const isIconColorRGBA = 'red' in iconColor;
	const iconSize = textStyles.autoScale === false ? textStyles.size : px(textStyles.size);
	
	const tweenButton = useCallback((tweenInfo: TweenInfo, properties: Partial<ExtractMembers<ImageButton, Tweenable>>) => {
		const button = buttonRef.current;
		if (button === undefined) {
			return;
		}
		
		tweenRef.current?.Cancel();
		
		const tween = TweenService.Create(button, tweenInfo, properties);
		tween.Play();
		tweenRef.current = tween;
	}, []);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, iconSize + px(padding) * 2)}
		>
			<imagebutton
				ref={buttonRef}
				BackgroundTransparency={1}
				Size={new UDim2(1, -px(30), 1, 0)}
				Position={new UDim2(1, 0, 0, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Image={'rbxassetid://116917521691205'}
				ImageColor3={isBackgroundRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
				ImageTransparency={isBackgroundRGBA ? 1 - background.alpha : 0}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(256, 256, 256, 256)}
				SliceScale={1}
				AutoButtonColor={false}
				Event={{
					MouseEnter: () => {
						tweenButton(new TweenInfo(0.6, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out), {
							Size: new UDim2(1, 0, 1, 0),
						});
					},
					MouseLeave: () => {
						tweenButton(new TweenInfo(0.2, Enum.EasingStyle.Sine, Enum.EasingDirection.Out), {
							Size: new UDim2(1, -px(30), 1, 0),
						});
					},
					MouseButton1Down: () => {
						tweenButton(new TweenInfo(0.1, Enum.EasingStyle.Sine, Enum.EasingDirection.Out), {
							Size: new UDim2(1, -px(15), 1, 0),
						});
					},
					MouseButton1Up: () => {
						tweenButton(new TweenInfo(0.6, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out), {
							Size: new UDim2(1, 0, 1, 0),
						});
					},
					MouseButton1Click: () => {
						onClick();
					},
				}}
			>
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
						Image={`rbxassetid://${iconId}`}
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
				{!isBackgroundRGBA && (
					<Gradient
						styles={background}
					/>
				)}
				{outline !== false && (
					<Outline
						styles={outline}
						applyStrokeMode={Enum.ApplyStrokeMode.Border}
					/>
				)}
				<Text
					styles={textStyles}
					text={text}
					automaticWidth
					automaticHeight
				/>
			</imagebutton>
		</frame>
	);
};

export default Button;
