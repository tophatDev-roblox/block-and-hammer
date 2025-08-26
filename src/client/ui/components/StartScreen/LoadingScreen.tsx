import React, { useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles } from 'client/styles';

import { useAtomBinding } from 'client/ui/hooks/use-atom-binding';
import { LoadingState } from 'client/ui/loading-state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import Text from '../Text';

const LoadingScreen: React.FC = () => {
	const isFinished = useAtom(LoadingState.isFinishedAtom);
	
	const percentage = useAtomBinding(LoadingState.percentageAtom);
	const status = useAtomBinding(LoadingState.statusAtom);
	
	const [anchorPoint, anchorPointMotion] = useMotion<Vector2>(Vector2.zero);
	
	const px = usePx();
	
	useEffect(() => {
		if (isFinished) {
			anchorPointMotion.tween(new Vector2(0, 1), {
				style: Enum.EasingStyle.Sine,
				direction: Enum.EasingDirection.In,
				time: 0.4,
			});
		}
	}, [isFinished]);
	
	return (
		<frame
			key={'LoadingScreen'}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			Size={UDim2.fromScale(1, 1)}
			AnchorPoint={anchorPoint}
			ZIndex={10}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				padding={px(Styles.UI.loadingScreen.listPadding)}
				alignX={Enum.HorizontalAlignment.Center}
				alignY={Enum.VerticalAlignment.Center}
			/>
			<Text
				text={'block and hammer'}
				styles={Styles.UI.loadingScreen.title}
				autoHeight
				order={0}
			/>
			<canvasgroup
				{...Styles.applyBackgroundColorProps(Styles.UI.loadingScreen.progressBar.unloadedColor)}
				Size={UDim2.fromOffset(px(800), px(30))}
				LayoutOrder={1}
				ClipsDescendants
			>
				<uicorner
					CornerRadius={new UDim(1, 0)}
				/>
				<frame
					{...Styles.applyBackgroundColorProps(Styles.UI.loadingScreen.progressBar.unloadedColor)}
					AnchorPoint={percentage.map((percentage) => new Vector2(1 - percentage, 0))}
					Size={UDim2.fromScale(1, 1)}
				>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</frame>
			</canvasgroup>
			<Text
				text={status}
				styles={Styles.UI.loadingScreen.status}
				autoHeight
				order={2}
			/>
		</frame>
	);
};

export default LoadingScreen;
