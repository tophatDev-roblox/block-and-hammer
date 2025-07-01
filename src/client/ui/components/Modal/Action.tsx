import { GuiService } from '@rbxts/services';
import React, { useEffect, useRef, useState } from '@rbxts/react';
import { useEventListener, useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { usePx } from 'client/ui/hooks/usePx';
import { InputType } from 'client/inputType';
import { StyleParse, Styles } from 'client/styles';
import UIPadding from '../UIPadding';
import Outline from '../Outline';
import Text from '../Text';

interface ActionProps {
	styles: Styles.ButtonWithInteraction;
	action: string;
	autoSelect: boolean;
	selectable: boolean;
	onClick: () => void;
}

const Action: React.FC<ActionProps> = ({ styles, action, autoSelect, selectable, onClick }) => {
	const {
		background,
		outline,
		text,
		tween,
		hover,
		pressed,
	} = styles;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	const [isPressed, setPressed] = useState<boolean>(false);
	
	const buttonRef = useRef<TextButton>();
	
	const [backgroundColor, backgroundColorMotion] = useMotion<Color3>(StyleParse.color(background));
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1 - background.alpha);
	
	const inputType = useAtom(InputType.stateAtom);
	
	const px = usePx();
	
	useEffect(() => {
		let backgroundRGBA = background;
		if (isPressed) {
			backgroundRGBA = pressed.background ?? hover.background ?? background;
		} else if (isHovered) {
			backgroundRGBA = hover.background ?? background;
		}
		
		const easingDirection = tween.direction === 'in' ? Enum.EasingDirection.In : Enum.EasingDirection.Out;
		const easingStyle = StyleParse.TweenStyleMap[tween.style];
		
		backgroundColorMotion.tween(StyleParse.color(backgroundRGBA), {
			time: tween.time,
			style: easingStyle,
			direction: easingDirection,
		});
		
		backgroundTransparencyMotion.tween(1 - backgroundRGBA.alpha, {
			time: tween.time,
			style: easingStyle,
			direction: easingDirection,
		});
	}, [hover, pressed, isHovered, isPressed]);
	
	useEffect(() => {
		const button = buttonRef.current;
		if (inputType !== InputType.Value.Controller || button === undefined || !selectable) {
			if (!selectable && GuiService.SelectedObject === button) {
				GuiService.SelectedObject = undefined;
			}
			
			return;
		}
		
		if (autoSelect) {
			GuiService.SelectedObject = button;
		}
	}, [autoSelect, selectable]);
	
	useEffect(() => {
		if (GuiService.SelectedObject === buttonRef.current) {
			setHovered(true);
		}
	}, []);
	
	useEventListener(GuiService.GetPropertyChangedSignal('SelectedObject'), () => {
		if (inputType !== InputType.Value.Controller) {
			return;
		}
		
		if (GuiService.SelectedObject === buttonRef.current) {
			setHovered(true);
		} else {
			setHovered(false);
		}
	});
	
	return (
		<textbutton
			ref={buttonRef}
			BackgroundColor3={backgroundColor}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Text={''}
			AutoButtonColor={false}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Down: () => setPressed(true),
				MouseButton1Up: () => setPressed(false),
				MouseButton1Click: onClick,
			}}
		>
			{outline !== false && (
				<Outline
					styles={outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			)}
			<uiflexitem
				FlexMode={Enum.UIFlexMode.Shrink}
			/>
			<uicorner
				CornerRadius={new UDim(0, px(25))}
			/>
			<UIPadding
				padding={px(25)}
			/>
			<Text
				styles={text}
				text={action}
			/>
		</textbutton>
	);
};

export default Action;
