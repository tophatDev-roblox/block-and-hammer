import React, { useCallback, useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import Ripple from '@rbxts/ripple';

import { throttle } from '@rbxts/set-timeout';

import { Camera } from 'client/camera';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import UIGradient from 'client/ui/components/UIGradient';
import Button from 'client/ui/components/Button';
import Text from 'client/ui/components/Text';

interface CheckboxProps {
	label: string;
	checked: boolean;
	onToggle: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle }) => {
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	
	const px = usePx();
	
	const [thumbBackground, thumbBackgroundMotion] = useMotion<Color3>(checked ? Color3.fromRGB(252, 255, 84) : Color3.fromRGB(255, 84, 84));
	const [thumbPosition, thumbPositionMotion] = useMotion<UDim2>(UDim2.fromScale(checked ? 1 : 0, 0));
	const [thumbAnchorPoint, thumbAnchorPointMotion] = useMotion<Vector2>(new Vector2(checked ? 1 : 0, 0));
	
	const onMouseButton1Click = useCallback(throttle((checked: boolean) => onToggle(!checked), 0.2), []);
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Bounce,
			direction: Enum.EasingDirection.Out,
			time: 0.5,
		};
		
		thumbBackgroundMotion.tween(checked ? Color3.fromRGB(252, 255, 84) : Color3.fromRGB(255, 84, 84), {
			...options,
			style: Enum.EasingStyle.Linear,
		});
		
		thumbPositionMotion.tween(UDim2.fromScale(checked ? 1 : 0, 0), options);
		thumbAnchorPointMotion.tween(new Vector2(checked ? 1 : 0, 0), options);
	}, [checked]);
	
	const settingsStyles = Styles.UI.panel.settings;
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, viewportSize.X * 0.5, 0, px(settingsStyles.item.label.size + settingsStyles.item.padding * 2))}
		>
			<Button
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={2}
				Event={{
					MouseButton1Click: () => onMouseButton1Click(checked),
				}}
			>
				<uicorner
					CornerRadius={new UDim(1, 0)}
				/>
			</Button>
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
				<frame
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					BackgroundTransparency={0.5}
					Size={UDim2.fromScale(1, 1)}
				>
					<uiaspectratioconstraint
						AspectRatio={2}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
					<UIPadding
						padding={px(settingsStyles.checkbox.padding)}
					/>
					<frame
						BackgroundColor3={thumbBackground}
						BackgroundTransparency={0}
						Size={UDim2.fromScale(1, 1)}
						SizeConstraint={Enum.SizeConstraint.RelativeYY}
						Position={thumbPosition}
						AnchorPoint={thumbAnchorPoint}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
					</frame>
				</frame>
			</frame>
		</frame>
	);
};

export default Checkbox;
