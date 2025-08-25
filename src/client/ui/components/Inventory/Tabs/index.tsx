import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../../UIListLayout';
import UIPadding from '../../UIPadding';
import Gradient from '../../Gradient';

import Tab from './Tab';

const Tabs: React.FC = () => {
	const px = usePx();
	
	const tabStyles = Styles.UI.inventory.tabs;
	
	return (
		<scrollingframe
			{...Styles.applyBackgroundColorProps(tabStyles.background)}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			ScrollBarThickness={px(8)}
			CanvasSize={UDim2.fromScale(1, 0)}
			AutomaticCanvasSize={Enum.AutomaticSize.X}
		>
			{tabStyles.background.type === 'gradient' && (
				<Gradient
					styles={tabStyles.background}
				/>
			)}
			<uicorner
				CornerRadius={new UDim(0, px(20))}
			/>
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				padding={px(tabStyles.padding)}
			/>
			<UIPadding
				padding={px(tabStyles.padding)}
			/>
			<Tab
				text={'Accessories'}
				tab={UI.Inventory.Tab.Accessories}
			/>
			<Tab
				text={'Customization'}
				tab={UI.Inventory.Tab.Customization}
			/>
		</scrollingframe>
	);
};

export default Tabs;
