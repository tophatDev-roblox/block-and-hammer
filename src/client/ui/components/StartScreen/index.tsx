import { RunService, UserInputService, Workspace } from '@rbxts/services';

import React, { useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { useEventListener, useMotion, useMountEffect } from '@rbxts/pretty-react-hooks';

import { createMotion } from '@rbxts/ripple';
import { setTimeout } from '@rbxts/set-timeout';
import { peek } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';

import { Effects } from 'client/effects';
import { Camera } from 'client/camera';
import { Styles } from 'client/styles';

import { LoadingState } from 'client/ui/loading-state';
import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';

import LoadingScreen from './LoadingScreen';
import SideButton from '../SideButton';
import ScreenGUI from '../ScreenGUI';
import Text from '../Text';
import { TransitionState } from 'client/ui/transition-state';

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
	
	assert(prop.PrimaryPart !== undefined);
	
	hitPart = prop.PrimaryPart;
	head = await waitForChild(hammer, 'Head', 'Part');
	pivot = await waitForChild(hammer, 'Pivot', 'Part');
	startPivot = await waitForChild(startScreen, 'StartPivot', 'Part');
	endPivot = await waitForChild(startScreen, 'EndPivot', 'Part');
	cameraPart = await waitForChild(startScreen, 'Camera', 'Part');
})();

const StartScreen: React.FC = () => {
	const isLoadingFinished = useAtom(LoadingState.isFinishedAtom);
	
	const [logoTransparency, logoTransparencyMotion] = useMotion<number>(1);
	const [logoAnchorPoint, logoAnchorPointMotion] = useMotion<Vector2>(new Vector2(1, 0));
	
	const [buttonsAnchorPoint, buttonsAnchorPointMotion] = useMotion<Vector2>(new Vector2(0, 1));
	
	const px = usePx();
	
	useMountEffect(() => {
		Camera.cframeMotion.immediate(cameraPart.CFrame);
	});
	
	useEventListener(RunService.PreRender, () => {
		const camera = peek(Camera.instanceAtom);
		if (camera === undefined) {
			return;
		}
		
		const mouse = UserInputService.GetMouseLocation();
		
		const angle = new Vector2(
			math.map(mouse.X, 0, camera.ViewportSize.X, 1, -1) * math.rad(2),
			math.map(mouse.Y, 0, camera.ViewportSize.Y, 1, -1) * math.rad(2),
		);
		
		Camera.cframeMotion.spring(cameraPart.CFrame.mul(CFrame.fromEulerAnglesYXZ(angle.Y, angle.X, 0)), {
			tension: 250,
			friction: 30,
		});
	});
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
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
			
			logoAnchorPointMotion.tween(logoAnchorPoint, tweenOptions);
			
			buttonsAnchorPointMotion.tween(buttonsAnchorPoint, {
				time: 0.7,
				style: Enum.EasingStyle.Elastic,
				direction: Enum.EasingDirection.Out,
			});
		}, 0.5);
		
		return () => {
			pivot.CFrame = startPivot.CFrame;
			clearTimeout();
		};
	}, [isLoadingFinished]);
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.StartScreen}
			IgnoreGuiInset
		>
			<LoadingScreen />
			<canvasgroup
				BackgroundTransparency={1}
				Position={new UDim2(1, px(-50), 0, px(250))}
				AutomaticSize={Enum.AutomaticSize.XY}
				AnchorPoint={logoAnchorPoint}
				GroupTransparency={logoTransparency}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
				/>
				<UIPadding
					padding={px(Styles.UI.startScreen.title.outline?.thickness ?? 0) * 2}
				/>
				<Text
					text={'block and hammer'}
					styles={Styles.UI.startScreen.title}
					autoWidth
					autoHeight
				/>
			</canvasgroup>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				Position={new UDim2(1, 0, 1, px(-100))}
				AnchorPoint={buttonsAnchorPoint}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					gap={px(Styles.UI.startScreen.listPadding)}
				/>
				<SideButton
					text={'Start'}
					icon={''}
					onClick={() => {
						if (peek(TransitionState.isTransitioningAtom)) {
							return;
						}
						
						TransitionState.beginTransitionAtom()
							.then((didTransition) => {
								if (!didTransition) {
									return;
								}
								
								UI.stateAtom(UI.State.Game)
							});
					}}
				/>
			</frame>
		</ScreenGUI>
	);
};

export default StartScreen;
