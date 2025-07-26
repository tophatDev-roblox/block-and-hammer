import { GuiService } from '@rbxts/services';

import React, { useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles } from 'shared/styles';

import { useAtomBinding } from 'client/ui/hooks/use-atom-binding';
import { LoadingState } from 'client/ui/loading-state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import Text from '../Text';

const LoadingScreen: React.FC= () => {
	const styles = useAtom(Styles.stateAtom);
	const isLoadingFinished = useAtom(LoadingState.isFinishedAtom);
	
	const loadingStatus = useAtomBinding(LoadingState.statusAtom);
	const percentageBinding = useAtomBinding(LoadingState.percentageAtom);
	
	const [position, positionMotion] = useMotion<UDim2>(isLoadingFinished ? UDim2.fromScale(0.5, -2) : UDim2.fromScale(0.5, 0.5));
	
	const px = usePx();
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		const position = UDim2.fromScale(0.5, -2);
		if (!GuiService.ReducedMotionEnabled) {
			positionMotion.tween(position, {
				time: 0.5,
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.In,
			});
		} else {
			positionMotion.immediate(position);
		}
	}, [isLoadingFinished]);
	
	return (
		<frame
			key={'LoadingScreen'}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Size={UDim2.fromScale(2, 2)}
			Position={position}
			AnchorPoint={new Vector2(0.5, 0.5)}
			ZIndex={2}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					padding={px(12)}
					alignX={Enum.HorizontalAlignment.Center}
					alignY={Enum.VerticalAlignment.Center}
				/>
				<Text
					styles={styles.startScreen.loading.logo}
					text={'block and hammer'}
					order={0}
					automaticWidth
					automaticHeight
				>
					<uigradient
						Transparency={percentageBinding.map((percentage) => new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(math.clamp(percentage, 0, 0.999), 0),
							new NumberSequenceKeypoint(math.clamp(percentage + 0.001, 0, 0.999), 0.5),
							new NumberSequenceKeypoint(1, 0.5),
						]))}
					/>
				</Text>
				<Text
					styles={styles.startScreen.loading.status}
					text={loadingStatus}
					order={1}
					automaticWidth
					automaticHeight
				/>
			</frame>
		</frame>
	);
};

export default LoadingScreen;
