import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import ScreenGUI from '../ScreenGUI';

import Buttons from './Buttons';
import Content from './Content';
import Tabs from './Tabs';

const Inventory: React.FC = () => {
	const px = usePx();
	
	const inventoryStyles = Styles.UI.inventory;
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.Inventory}
		>
			<UIPadding
				padding={px(inventoryStyles.padding)}
			/>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0, px(1500), 1, 0)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					gap={px(inventoryStyles.gap)}
				/>
				<UIPadding
					padding={px(inventoryStyles.padding)}
				/>
				<Tabs />
				<Content />
			</frame>
			<Buttons />
		</ScreenGUI>
	);
};

export default Inventory;
