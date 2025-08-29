import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../../UIListLayout';

import Button from './Button';
import { Assets } from 'shared/assets';
import { UI } from 'client/ui/state';
import { TransitionState } from 'client/ui/transition-state';

const Buttons: React.FC = () => {
	const componentStyles = Styles.UI.inventory.buttons;
	
	const px = usePx();
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				padding={px(componentStyles.gap)}
				alignX={Enum.HorizontalAlignment.Right}
				alignY={Enum.VerticalAlignment.Bottom}
			/>
			<Button
				icon={Assets.Icons.CloseIcon}
				onClick={() => {
					TransitionState.beginTransitionAtom()
						.then((didTransition) => {
							if (!didTransition) {
								return;
							}
							
							UI.stateAtom(UI.State.Game);
						});
				}}
			/>
		</frame>
	);
};

export default Buttons;
