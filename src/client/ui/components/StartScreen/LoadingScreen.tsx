import { GuiService } from '@rbxts/services';
import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { computed } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';

import { StartScreenState } from 'client/ui/startScreenState';
import { useAtomBinding } from 'client/ui/hooks/useAtomBinding';
import { usePx } from 'client/ui/hooks/usePx';
import { Styles } from 'shared/styles';
import UIListLayout from '../UIListLayout';
import Text from '../Text';

const LoadingScreen: React.FC= () => {
	const styles = useAtom(Styles.stateAtom);
	const isLoadingFinished = useAtom(StartScreenState.isLoadingFinishedAtom);
	
	const loadingStatus = useAtomBinding(StartScreenState.loadingStatusAtom);
	const percentageSize = useAtomBinding(computed(() => UDim2.fromScale(StartScreenState.loadingPercentageAtom(), 1)));
	const percentageText = useAtomBinding(computed(() => '%.1f%%'.format(StartScreenState.loadingPercentageAtom() * 100)));
	
	const [position, positionMotion] = useMotion<UDim2>(isLoadingFinished ? UDim2.fromScale(0, -1) : UDim2.fromScale(0, 0));
	
	const px = usePx();
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		const position = UDim2.fromScale(0, -1);
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
			Size={UDim2.fromScale(1, 1)}
			Position={position}
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
				/>
				<Text
					styles={styles.startScreen.loading.status}
					text={loadingStatus}
					order={1}
					automaticWidth
					automaticHeight
				/>
			</frame>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 0, px(30))}
				Position={UDim2.fromScale(0, 1)}
				AnchorPoint={new Vector2(0, 1)}
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={percentageSize}
				/>
				<frame
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					Position={UDim2.fromOffset(0, px(-10))}
					AnchorPoint={new Vector2(0, 1)}
				>
					<Text
						styles={styles.startScreen.loading.percentage}
						text={percentageText}
						automaticHeight
					/>
				</frame>
			</frame>
		</frame>
	);
};

export default LoadingScreen;
