import React from '@rbxts/react';

import { Assets } from 'shared/assets';

import { Styles } from 'client/styles';

import { TransitionState } from 'client/ui/transition-state';
import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import ScreenGUI from '../ScreenGUI';

import CircleButton from './CircleButton';
import Content from './Content';
import Tabs from './Tabs';

const Inventory: React.FC = () => {
	const px = usePx();
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.Inventory}
		>
			<UIPadding
				padding={px(Styles.UI.inventory.padding)}
			/>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.7, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					padding={px(Styles.UI.inventory.listPadding)}
				/>
				<Tabs />
				<Content />
			</frame>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Horizontal}
					padding={px(Styles.UI.inventory.listPadding)}
					alignX={Enum.HorizontalAlignment.Right}
					alignY={Enum.VerticalAlignment.Bottom}
				/>
				<CircleButton
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
		</ScreenGUI>
	);
};

export default Inventory;
