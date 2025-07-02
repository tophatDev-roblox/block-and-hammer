import { GuiService, RunService, TweenService, Workspace } from '@rbxts/services';
import { setTimeout } from '@rbxts/set-timeout';
import React, { useEffect, useState } from '@rbxts/react';
import { useEventListener, useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';
import Ripple from '@rbxts/ripple';

import { usePx } from 'client/ui/hooks/usePx';
import { StartScreenState } from 'client/ui/startScreenState';
import { StyleParse, Styles } from 'client/styles';
import { camera } from 'client/camera';
import { Effects } from 'client/effects';
import Text from '../Text';
import Button from './Button';
import LoadingScreen from './LoadingScreen';
import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';

const startScreen = Workspace.WaitForChild('StartScreen') as Model;
const prop = startScreen.WaitForChild('Prop') as Model;
const hitPart = prop.PrimaryPart!;
const hammer = startScreen.WaitForChild('Hammer') as Model;
const head = hammer.WaitForChild('Head') as Part;
const pivot = hammer.WaitForChild('Pivot') as Part;
const startPivot = startScreen.WaitForChild('StartPivot') as Part;
const endPivot = startScreen.WaitForChild('EndPivot') as Part;
const cameraPart = startScreen.WaitForChild('Camera') as Part;

const StartScreen: React.FC = () => {
	const [selectable, setSelectable] = useState<boolean>(false);
	
	const isVisible = useAtom(StartScreenState.isVisibleAtom);
	const styles = useAtom(Styles.stateAtom);
	const isLoadingFinished = useAtom(StartScreenState.isLoadingFinishedAtom);
	
	const [logoTransparency, logoTransparencyMotion] = useMotion<number>(1);
	const [logoAnchorPoint, logoAnchorPointMotion] = useMotion<Vector2>(new Vector2(1, 0));
	const [buttonsAnchorPoint, buttonsAnchorPointMotion] = useMotion<Vector2>(new Vector2(0, 1));
	
	const px = usePx();
	
	useEventListener(RunService.RenderStepped, () => {
		camera.FieldOfView = 45;
		camera.CameraType = Enum.CameraType.Scriptable;
		camera.CFrame = cameraPart.CFrame;
	});
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		setSelectable(false);
		pivot.CFrame = startPivot.CFrame;
		
		const clearTimeout = setTimeout(() => {
			const hammerTween = TweenService.Create(pivot, new TweenInfo(0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.In), {
				CFrame: endPivot.CFrame,
			});
			
			hammerTween.Play();
			
			hammerTween.Completed.Connect(() => {
				Effects.makeHitParticles(
					hitPart.Material,
					Effects.createBaseParticle(hitPart),
					head.Position.add(head.CFrame.RightVector.mul(head.Size.X / 2)),
					head.CFrame.RightVector.mul(-1),
					Vector3.zero,
				);
			});
			
			const tweenOptions: Ripple.TweenOptions = {
				time: 0.5,
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.Out,
			};
			
			logoTransparencyMotion.tween(0, tweenOptions);
			
			const logoAnchorPoint = new Vector2(1, 1);
			const buttonsAnchorPoint = new Vector2(0.8, 1);
			if (!GuiService.ReducedMotionEnabled) {
				logoAnchorPointMotion.tween(logoAnchorPoint, tweenOptions);
				
				buttonsAnchorPointMotion.tween(buttonsAnchorPoint, {
					time: 0.7,
					style: Enum.EasingStyle.Elastic,
					direction: Enum.EasingDirection.Out,
				});
				
				setTimeout(() => setSelectable(true), 0.4);
			} else {
				logoAnchorPointMotion.immediate(logoAnchorPoint);
				buttonsAnchorPointMotion.immediate(buttonsAnchorPoint);
				
				setTimeout(() => setSelectable(true), 0.05);
			}
		}, 0.5);
		
		return () => {
			pivot.CFrame = startPivot.CFrame;
			clearTimeout();
		};
	}, [isLoadingFinished]);
	
	const logoOutline = styles.startScreen.logo.outline;
	
	const logoPadding = logoOutline !== false ? StyleParse.px(px, logoOutline.thickness, logoOutline.autoScale) : 0;
	
	return (
		<screengui
			DisplayOrder={50}
			ScreenInsets={Enum.ScreenInsets.None}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			ResetOnSpawn={false}
			Enabled={isVisible}
		>
			<LoadingScreen />
			<canvasgroup
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				Position={new UDim2(1, px(-30), 0, px(300))}
				AnchorPoint={logoAnchorPoint}
				GroupTransparency={logoTransparency}
			>
				<UIPadding
					padding={logoPadding}
				/>
				<Text
					styles={styles.startScreen.logo}
					text={'block and hammer'}
					automaticWidth
					automaticHeight
				/>
			</canvasgroup>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(px(600), 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				Position={new UDim2(1, 0, 1, px(-80))}
				AnchorPoint={buttonsAnchorPoint}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					padding={px(20)}
					alignX={Enum.HorizontalAlignment.Right}
				/>
				<Button
					styles={styles.startScreen.button}
					text={'Start'}
					iconId={''}
					index={0}
					selectable={selectable}
					autoSelect
					onClick={() => {
						GuiService.SelectedObject = undefined;
						StartScreenState.isVisibleAtom(false);
					}}
				/>
			</frame>
		</screengui>
	);
};

export default StartScreen;
