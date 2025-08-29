import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../../UIListLayout';

import Tab from './Tab';

const Tabs: React.FC = () => {
	const px = usePx();
	
	const inventoryStyles = Styles.UI.inventory;
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 0, px(70))}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				padding={px(inventoryStyles.tabs.gap)}
			/>
			<Tab
				text={'Accessories'}
				tab={UI.Inventory.Tab.Accessories}
			/>
			<Tab
				text={'Colors'}
				tab={UI.Inventory.Tab.Colors}
			/>
		</frame>
	);
};

export default Tabs;
