import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { UI } from 'client/ui/state';

import Accessories from './Accessories';
import Colors from './Colors';

const Content: React.FC = () => {
	const pageLayoutRef = useRef<UIPageLayout>();
	const pageAccessoriesRef = useRef<Frame>();
	const pageColorsRef = useRef<Frame>();
	
	const tab = useAtom(UI.Inventory.tabAtom);
	
	useEffect(() => {
		const pageLayout = pageLayoutRef.current;
		const pageAccessories = pageAccessoriesRef.current;
		const pageColors = pageColorsRef.current;
		
		if (pageLayout === undefined || pageAccessories === undefined || pageColors === undefined) {
			return;
		}
		
		switch (tab) {
			case UI.Inventory.Tab.Accessories: {
				pageLayout.JumpTo(pageAccessories);
				
				break;
			}
			case UI.Inventory.Tab.Colors: {
				pageLayout.JumpTo(pageColors);
				
				break;
			}
		}
	}, [tab]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0)}
			ClipsDescendants
		>
			<uiflexitem
				FlexMode={Enum.UIFlexMode.Grow}
			/>
			<uipagelayout
				ref={pageLayoutRef}
				EasingDirection={Enum.EasingDirection.Out}
				EasingStyle={Enum.EasingStyle.Sine}
				TweenTime={0.4}
				ScrollWheelInputEnabled={false}
				TouchInputEnabled={false}
				Animated
			/>
			<Accessories
				ref={pageAccessoriesRef}
			/>
			<Colors
				ref={pageColorsRef}
			/>
		</frame>
	);
};

export default Content;
