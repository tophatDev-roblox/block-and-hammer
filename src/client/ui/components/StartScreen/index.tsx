import { RunService, TweenService, Workspace } from '@rbxts/services';
import React, { useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { useEventListener, useMotion } from '@rbxts/pretty-react-hooks';
import Ripple from '@rbxts/ripple';

import { clearTimeout, setTimeout } from 'shared/timeout';
import { usePx } from 'client/ui/hooks/usePx';
import { StartScreenState } from 'client/startScreenState';
import { useGamepadNavigation } from 'client/ui/hooks/useGamepadNavigation';
import { useAtomBinding } from 'client/ui/hooks/useAtomBinding';
import { Styles } from 'client/styles';
import { camera } from 'client/camera';
import { Effects } from 'client/effects';
import Text from '../Text';
import Button from './Button';
import { computed } from '@rbxts/charm';

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
	const isVisible = useAtom(StartScreenState.isVisibleAtom);
	const isLoadingFinished = useAtom(StartScreenState.isLoadingFinished);
	const styles = useAtom(Styles.stateAtom);
	const loadingStatus = useAtomBinding(StartScreenState.loadingStatusAtom);
	const loadingPercentage = useAtomBinding(computed(() => new UDim2(StartScreenState.loadingPercentage(), 0, 1, 0)));
	
	const [position, positionMotion] = useMotion<UDim2>(isLoadingFinished ? new UDim2(0, 0, -1, 0) : new UDim2(0, 0, 0, 0));
	const [logoTransparency, logoTransparencyMotion] = useMotion<number>(1);
	const [logoAnchorPoint, logoAnchorPointMotion] = useMotion<Vector2>(new Vector2(1, 0));
	const [buttonsAnchorPoint, buttonsAnchorPointMotion] = useMotion<Vector2>(new Vector2(0, 1));
	
	const px = usePx();
	
	const [focusIndex, setFocusIndex] = useGamepadNavigation([
		new Vector2(0, 0),
	]);
	
	useEventListener(RunService.RenderStepped, () => {
		camera.FieldOfView = 45;
		camera.CameraType = Enum.CameraType.Scriptable;
		camera.CFrame = cameraPart.CFrame;
	});
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		setFocusIndex(-1);
		pivot.CFrame = startPivot.CFrame;
		
		positionMotion.tween(new UDim2(0, 0, -1, 0), {
			time: 0.5,
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.In,
		});
		
		const timeout = setTimeout(() => {
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
			logoAnchorPointMotion.tween(new Vector2(1, 1), tweenOptions);
			
			buttonsAnchorPointMotion.tween(new Vector2(0.8, 1), {
				time: 0.7,
				style: Enum.EasingStyle.Elastic,
				direction: Enum.EasingDirection.Out,
			});
			
			setFocusIndex(0);
		}, 0.5);
		
		return () => {
			pivot.CFrame = startPivot.CFrame;
			clearTimeout(timeout);
		};
	}, [isLoadingFinished]);
	
	const logoOutline = styles.startScreen.logo.outline;
	
	const logoPadding = logoOutline !== false
		? new UDim(0, logoOutline.autoScale ? px(logoOutline.thickness) : logoOutline.thickness)
		: new UDim(0, 0);
	
	return (
		<screengui
			DisplayOrder={50}
			ScreenInsets={Enum.ScreenInsets.None}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			ResetOnSpawn={false}
			Enabled={isVisible}
		>
			<frame
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 1, 0)}
				Position={position}
				ZIndex={2}
			>
				<frame
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						Padding={new UDim(0, px(12))}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					<Text
						styles={styles.startScreen.loading.logo}
						text={'block and hammer'}
						automaticWidth
						automaticHeight
					/>
					<Text
						styles={styles.startScreen.loading.status}
						text={loadingStatus}
						automaticWidth
						automaticHeight
					/>
				</frame>
				<frame
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 0, px(60))}
					Position={new UDim2(0, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
				>
					<frame
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={0.4}
						BorderSizePixel={0}
						Size={loadingPercentage}
					/>
				</frame>
			</frame>
			<canvasgroup
				BackgroundTransparency={1}
				Size={new UDim2(0, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				Position={new UDim2(1, px(-30), 0, px(300))}
				AnchorPoint={logoAnchorPoint}
				GroupTransparency={logoTransparency}
			>
				<uipadding
					PaddingTop={logoPadding}
					PaddingRight={logoPadding}
					PaddingBottom={logoPadding}
					PaddingLeft={logoPadding}
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
				Size={new UDim2(0, px(600), 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				Position={new UDim2(1, 0, 1, px(-80))}
				AnchorPoint={buttonsAnchorPoint}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					Padding={new UDim(0, px(20))}
				/>
				<Button
					styles={styles.startScreen.button}
					text={'Start'}
					iconId={''}
					index={0}
					focusIndex={focusIndex}
					onClick={() => {
						StartScreenState.isVisibleAtom(false);
					}}
				/>
			</frame>
		</screengui>
	);
};

export default StartScreen;
