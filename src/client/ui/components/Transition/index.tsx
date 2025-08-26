import React, { useEffect, useMemo } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { TimeSpan } from 'shared/time-span';

import { TransitionState } from 'client/ui/transition-state';
import { Camera } from 'client/camera';
import { UI } from 'client/ui/state';

import ScreenGUI from '../ScreenGUI';

const Transition: React.FC = () => {
	const [size, sizeMotion] = useMotion<UDim2>(UDim2.fromOffset(0, 0));
	const [rotation, rotationMotion] = useMotion<number>(0);
	
	const screenSize = useAtom(Camera.viewportSizeAtom);
	const isTransitioning = useAtom(TransitionState.isTransitioningAtom);
	
	const maxAxis = useMemo(() => math.max(screenSize.X, screenSize.Y), [screenSize]);
	
	useEffect(() => {
		if (!isTransitioning) {
			return;
		}
		
		(async () => {
			sizeMotion.immediate(UDim2.fromOffset(maxAxis, maxAxis));
			rotationMotion.immediate(0);
			
			sizeMotion.tween(UDim2.fromScale(0, 0), {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.Out,
				time: 0.5,
			});
			
			rotationMotion.tween(90, {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.Out,
				time: 0.5,
			});
			
			await TimeSpan.sleep(0.75);
			
			sizeMotion.tween(UDim2.fromOffset(maxAxis, maxAxis), {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.In,
				time: 0.5,
			});
			
			rotationMotion.tween(180, {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.In,
				time: 0.5,
			});
			
			await TimeSpan.sleep(0.5);
			
			TransitionState.isTransitioningAtom(false);
		})();
	}, [isTransitioning, maxAxis]);
	
	if (!isTransitioning) {
		return (
			<ScreenGUI
				DisplayOrder={UI.DisplayOrder.Transition}
				Enabled={false}
				IgnoreGuiInset
			/>
		);
	}
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.Transition}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={size}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Rotation={rotation}
			>
				<uistroke
					Color={Color3.fromRGB(0, 0, 0)}
					Thickness={9999}
					LineJoinMode={Enum.LineJoinMode.Miter}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			</frame>
		</ScreenGUI>
	);
};

export default Transition;
