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
	const [isHovered, setHovered] = useState<boolean>(false);
	
	const selectedTab = useAtom(UI.Inventory.tabAtom);
	
	const tabStyles = Styles.UI.inventory.tabs;
	
	const [backgroundColor, backgroundColorMotion] = useMotion<Color3>(tabStyles.unselectedBackground.color);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion<number>(1 - tabStyles.unselectedBackground.alpha);
	
	const px = usePx();
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Linear,
			time: 0.1,
		};
		
		let color: Styles.Color;
		
		if (tab === selectedTab) {
			color = tabStyles.selectedBackground;
		} else {
			if (isHovered) {
				color = tabStyles.hoveredBackground;
			} else {
				color = tabStyles.unselectedBackground;
			}
		}
		
		backgroundColorMotion.tween(color.color, options);
		backgroundTransparencyMotion.tween(1 - color.alpha, options);
	}, [tab, selectedTab, isHovered]);
	
	return (
		<Button
			BackgroundColor3={backgroundColor}
			BackgroundTransparency={backgroundTransparency}
			Size={UDim2.fromScale(0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Click: () => UI.Inventory.tabAtom(tab),
			}}
		>
			<uicorner
				CornerRadius={new UDim(0, px(20 - tabStyles.padding))}
			/>
			<UIPadding
				padding={px(tabStyles.padding)}
			/>
			<Text
				styles={Styles.UI.inventory.tabs.text}
				text={text}
				autoWidth
				autoHeight
			/>
		</Button>
	);
};

export default Tab;
