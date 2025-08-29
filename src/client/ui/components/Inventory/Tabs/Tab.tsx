import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import Ripple from '@rbxts/ripple';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIPadding from '../../UIPadding';
import Button from '../../Button';
import Text from '../../Text';

interface TabProps {
	text: string;
	tab: UI.Inventory.Tab;
}

const Tab: React.FC<TabProps> = ({ text, tab }) => {
	const inventoryStyles = Styles.UI.inventory;
	
	const [isHovered, setHovered] = useState<boolean>(false);
	
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1 - inventoryStyles.tabs.tab.background.alpha);
	const [borderRadius, borderRadiusMotion] = useMotion<UDim>(new UDim(0, inventoryStyles.tabs.tab.borderRadius));
	const [backgroundColor, backgroundColorMotion] = useMotion<Color3>(inventoryStyles.tabs.tab.background.color);
	
	const currentTab = useAtom(UI.Inventory.tabAtom);
	
	const px = usePx();
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.Out,
			time: 0.2,
		};
		
		let color: Styles.Color;
		
		if (currentTab === tab) {
			color = inventoryStyles.tabs.tab.backgroundSelected;
			
			borderRadiusMotion.tween(new UDim(0, px(inventoryStyles.tabs.tab.borderRadiusSelected)), options);
		} else {
			if (isHovered) {
				color = inventoryStyles.tabs.tab.background;
				
				borderRadiusMotion.tween(new UDim(0, px(inventoryStyles.tabs.tab.borderRadiusHover)), options);
			} else {
				color = inventoryStyles.tabs.tab.background;
				
				borderRadiusMotion.tween(new UDim(0, px(inventoryStyles.tabs.tab.borderRadius)), options);
			}
		}
		
		backgroundColorMotion.tween(color.color, options);
		backgroundTransparencyMotion.tween(1 - color.alpha, options);
	}, [isHovered, currentTab]);
	
	return (
		<Button
			BackgroundColor3={backgroundColor}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromScale(0, 1)}
			AutomaticSize={Enum.AutomaticSize.X}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Click: () => UI.Inventory.tabAtom(tab),
			}}
		>
			<uicorner
				CornerRadius={borderRadius}
			/>
			<UIPadding
				padding={[0, px(Styles.UI.inventory.tabs.tab.padding)]}
			/>
			<Text
				styles={Styles.UI.inventory.tabs.tab.text}
				text={text}
				autoWidth
			/>
		</Button>
	);
};

export default Tab;
