import { RunService, SoundService, UserInputService, Workspace } from '@rbxts/services';

import React, { useEffect, useRef, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import Ripple from '@rbxts/ripple';

import { waitForChild } from 'shared/wait-for-child';
import { Number } from 'shared/number';

import { Camera } from 'client/camera';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import UIGradient from 'client/ui/components/UIGradient';
import Button from 'client/ui/components/Button';
import Text from 'client/ui/components/Text';

let uiHoverSound: Sound;

(async () => {
	uiHoverSound = await waitForChild(SoundService, 'UIHover', 'Sound');
})();

interface SliderProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	decimals: number;
	onChange: (newValue: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, decimals, onChange }) => {
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const sliderBackgroundRef = useRef<Frame>();
	const textBoxRef = useRef<TextBox>();
	
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	
	const px = usePx();
	
	const [thumbPosition, thumbPositionMotion] = useMotion<UDim2>(UDim2.fromScale(math.map(value, min, max, 0, 1), 0.5));
	const [thumbSize, thumbSizeMotion] = useMotion<UDim2>(UDim2.fromOffset(px(30), px(30)));
	
	const settingsStyles = Styles.UI.panel.settings;
	const sliderStyles = settingsStyles.slider;
	
	const formatString = `%.${decimals}f`;
	
	useEffect(() => {
		const props: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Elastic,
			direction: Enum.EasingDirection.Out,
			time: 0.6,
		};
		
		if (isPressed) {
			thumbSizeMotion.tween(UDim2.fromOffset(px(35), px(35)), props);
		} else {
			if (isHovered) {
				thumbSizeMotion.tween(UDim2.fromOffset(px(40), px(40)), props);
			} else {
				thumbSizeMotion.tween(UDim2.fromOffset(px(30), px(30)), props);
			}
		}
	}, [isHovered, isPressed]);
	
	useEffect(() => {
		const targetPosition = UDim2.fromScale(math.map(value, min, max, 0, 1), 0.5);
		
		thumbPositionMotion.tween(targetPosition, {
			style: Enum.EasingStyle.Back,
			direction: Enum.EasingDirection.Out,
			time: 0.4,
		});
	}, [value]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, viewportSize.X * 0.5, 0, px(settingsStyles.item.label.size + settingsStyles.item.padding * 2))}
		>
			<frame
				{...Styles.applyBackgroundColorProps(settingsStyles.item.background)}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={1}
			>
				{settingsStyles.item.background.type === 'gradient' && (
					<UIGradient
						styles={settingsStyles.item.background}
					/>
				)}
				<UIListLayout
					fillDirection={Enum.FillDirection.Horizontal}
					alignY={Enum.VerticalAlignment.Center}
				/>
				<UIPadding
					padding={px(settingsStyles.item.padding)}
					overrides={{
						PaddingLeft: new UDim(0, px(settingsStyles.item.padding * 2)),
					}}
				/>
				<uicorner
					CornerRadius={new UDim(1, 0)}
				/>
				<Text
					styles={settingsStyles.item.label}
					text={label}
					alignX={Enum.TextXAlignment.Left}
					autoHeight
					autoWidth
				>
					<uiflexitem
						FlexMode={Enum.UIFlexMode.Grow}
					/>
				</Text>
				<textbox
					{...Styles.applyTextColorProps(sliderStyles.input.color)}
					ref={textBoxRef}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					BackgroundTransparency={0.5}
					Size={UDim2.fromScale(1, 1)}
					FontFace={sliderStyles.input.font}
					TextSize={px(sliderStyles.input.size)}
					Text={formatString.format(value)}
					PlaceholderText={formatString.format(value)}
					PlaceholderColor3={sliderStyles.placeholder.color}
					Event={{
						FocusLost: (textBox) => {
							const number = tonumber(textBox.ContentText) || value;
							
							if (Number.isNaN(number)) {
								textBox.Text = formatString.format(value);
								
								return;
							}
							
							const newValue = Number.clampStep(number, min, max, step);
							
							textBox.Text = formatString.format(newValue);
							
							if (newValue !== value) {
								onChange(newValue);
							}
						},
					}}
				>
					<uiaspectratioconstraint
						AspectRatio={2.5}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</textbox>
				<Button
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.35, 1)}
					Event={{
						MouseEnter: () => {
							setHovered(true);
						},
						MouseLeave: () => {
							setHovered(false);
						},
						MouseButton1Down: () => {
							const sliderBackground = sliderBackgroundRef.current;
							const textBox = textBoxRef.current;
							
							if (sliderBackground === undefined || textBox === undefined) {
								return;
							}
							
							setPressed(true);
							
							const left = sliderBackground.AbsolutePosition.X;
							const right = left + sliderBackground.AbsoluteSize.X;
							
							let previousValue = value;
							
							const renderSteppedEvent = RunService.RenderStepped.Connect(() => {
								const mouseLocation = UserInputService.GetMouseLocation();
								
								const percentageX = math.clamp(math.map(mouseLocation.X, left, right, 0, 1), 0, 1);
								const targetPosition = UDim2.fromScale(percentageX, 0.5);
								
								const newValue = Number.clampStep(math.map(percentageX, 0, 1, min, max), min, max, step);
								
								if (previousValue !== newValue) {
									textBox.Text = formatString.format(newValue);
									
									const sound = uiHoverSound.Clone();
									sound.PlaybackSpeed = math.map(percentageX, 0, 1, 0.9, 1.2);
									sound.Volume = 0.5;
									sound.Parent = Workspace;
									sound.Destroy();
									
									previousValue = newValue;
								}
								
								if (!UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1)) {
									renderSteppedEvent.Disconnect();
									
									if (newValue !== value) {
										onChange(newValue);
									}
									
									setPressed(false);
								} else {
									thumbPositionMotion.spring(targetPosition, {
										tension: 400,
										friction: 24,
									});
								}
							});
						},
					}}
				>
					<uipadding
						PaddingLeft={new UDim(0, px(settingsStyles.slider.padding * 3))}
						PaddingRight={new UDim(0, px(settingsStyles.slider.padding * 2))}
					/>
					<frame
						ref={sliderBackgroundRef}
						BackgroundColor3={Color3.fromRGB(0, 0, 0)}
						BackgroundTransparency={0.5}
						Size={new UDim2(1, 0, 0, px(20))}
						Position={UDim2.fromScale(0, 0.5)}
						AnchorPoint={new Vector2(0, 0.5)}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
					</frame>
					<frame
						{...Styles.applyBackgroundColorProps(settingsStyles.slider.thumb)}
						Size={thumbSize}
						Position={thumbPosition}
						AnchorPoint={new Vector2(0.5, 0.5)}
					>
						{settingsStyles.slider.thumb.type === 'gradient' && (
							<UIGradient
								styles={settingsStyles.slider.thumb}
							/>
						)}
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
					</frame>
				</Button>
			</frame>
		</frame>
	);
};

export default Slider;
