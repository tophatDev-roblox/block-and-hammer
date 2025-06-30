import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { computed } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';

import { StartScreenState } from 'client/startScreenState';
import { useAtomBinding } from 'client/ui/hooks/useAtomBinding';
import { Styles } from 'client/styles';
import { usePx } from 'client/ui/hooks/usePx';
import Text from '../Text';

const LoadingScreen: React.FC= () => {
	const styles = useAtom(Styles.stateAtom);
	const isLoadingFinished = useAtom(StartScreenState.isLoadingFinished);
	
	const loadingStatus = useAtomBinding(StartScreenState.loadingStatusAtom);
	const percentageSize = useAtomBinding(computed(() => new UDim2(StartScreenState.loadingPercentage(), 0, 1, 0)));
	const percentageText = useAtomBinding(computed(() => '%.1f%%'.format(StartScreenState.loadingPercentage() * 100)));
	
	const [position, positionMotion] = useMotion<UDim2>(isLoadingFinished ? new UDim2(0, 0, -1, 0) : new UDim2(0, 0, 0, 0));
	
	const px = usePx();
	
	useEffect(() => {
		if (!isLoadingFinished) {
			return;
		}
		
		positionMotion.tween(new UDim2(0, 0, -1, 0), {
			time: 0.5,
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.In,
		});
	}, [isLoadingFinished]);
	
	return (
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
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={percentageSize}
				/>
				<frame
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 0, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					Position={new UDim2(0, 0, 0, px(-10))}
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
