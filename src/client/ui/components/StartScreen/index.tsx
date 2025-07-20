import { GuiService, RunService, Workspace } from '@rbxts/services';

import React, { useEffect, useMemo, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { createMotion } from '@rbxts/ripple';
import { setTimeout } from '@rbxts/set-timeout';

import { StyleParse, Styles } from 'shared/styles';
import { waitForChild } from 'shared/wait-for-child';

import { Effects } from 'client/effects';
import { Camera } from 'client/camera';

import { LoadingState } from 'client/ui/loading-state';
import { PathState } from 'client/ui/path-state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Text from '../Text';

import LoadingScreen from './LoadingScreen';
import Button from './Button';

let hitPart: BasePart;
let head: Part;
let pivot: Part;
let startPivot: Part;
let endPivot: Part;
let cameraPart: Part;

(async () => {
	const startScreen = await waitForChild(Workspace, 'StartScreen', 'Model');
	const prop = await waitForChild(startScreen, 'Prop', 'Model');
	const hammer = await waitForChild(startScreen, 'Hammer', 'Model');
	
	hitPart = prop.PrimaryPart!;
	head = await waitForChild(hammer, 'Head', 'Part');
	pivot = await waitForChild(hammer, 'Pivot', 'Part');
	startPivot = await waitForChild(startScreen, 'StartPivot', 'Part');
	endPivot = await waitForChild(startScreen, 'EndPivot', 'Part');
	cameraPart = await waitForChild(startScreen, 'Camera', 'Part');
})();

const StartScreenGUI: React.FC = () => {
	const [selectable, setSelectable] = useState<boolean>(false);
	
	const path = useAtom(PathState.valueAtom);
	const styles = useAtom(Styles.stateAtom);
	const isLoadingFinished = useAtom(LoadingState.isFinishedAtom);
	
	const isVisible = useMemo(() => PathState.isAt(PathState.Location.StartScreen, path), [path]);
	
	const [logoTransparency, logoTransparencyMotion] = useMotion<number>(1);
	const [logoAnchorPoint, logoAnchorPointMotion] = useMotion<Vector2>(new Vector2(1, 0));
	const [buttonsAnchorPoint, buttonsAnchorPointMotion] = useMotion<Vector2>(new Vector2(0, 1));
	
	const px = usePx();
	
	useEffect(() => {
		Camera.cframeMotion.immediate(cameraPart.CFrame);
	}, []);
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		setSelectable(false);
		pivot.CFrame = startPivot.CFrame;
		
		const clearTimeout = setTimeout(() => {
			const hammerMotion = createMotion<number>(0, {
				heartbeat: RunService.PreRender,
				start: true,
			});
			
			hammerMotion.tween(1, {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.In,
				time: 0.3,
			});
			
			hammerMotion.onStep((alpha) => {
				pivot.CFrame = startPivot.CFrame.Lerp(endPivot.CFrame, alpha);
			});
			
			hammerMotion.onComplete(() => {
				hammerMotion.destroy();
				
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
			const buttonsAnchorPoint = new Vector2(0.3, 1);
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
	const logoPadding = logoOutline !== undefined ? StyleParse.px(px, logoOutline.thickness, logoOutline.autoScale) : 0;
	
	return (
		<screengui
			key={'StartScreenGUI'}
			DisplayOrder={50}
			ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			ResetOnSpawn={false}
			ClipToDeviceSafeArea={false}
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
				Size={UDim2.fromScale(1, 0)}
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
						PathState.valueAtom([]);
					}}
				/>
			</frame>
		</screengui>
	);
};

export default StartScreenGUI;
