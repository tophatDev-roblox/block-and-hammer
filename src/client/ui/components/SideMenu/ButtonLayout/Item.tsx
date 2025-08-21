import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { setTimeout } from '@rbxts/set-timeout';

import { usePx } from 'client/ui/hooks/use-px';

import UIPadding from '../../UIPadding';

interface ItemProps {
	child: React.ReactNode;
	index: number;
	buttonHeight: number;
	paddingChange: number;
	sideMenuOpen: boolean;
}

const Item: React.FC<ItemProps> = ({ child, index, buttonHeight, paddingChange, sideMenuOpen }) => {
	const px = usePx();
	
	const [size, sizeMotion] = useMotion<UDim2>(new UDim2(1, px(-600), 0, buttonHeight));
	
	useEffect(() => {
		if (sideMenuOpen) {
			return setTimeout(() => {
				sizeMotion.tween(new UDim2(1, 0, 0, buttonHeight), {
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.Out,
					time: 0.4,
				});
			}, index * 0.03);
		} else {
			return setTimeout(() => {
				sizeMotion.tween(new UDim2(1, px(-600), 0, buttonHeight), {
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.In,
					time: 0.3,
				});
			}, index * 0.03);
		}
	}, [sideMenuOpen, buttonHeight, px]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={size}
		>
			<UIPadding
				padding={[0, 0, 0, paddingChange * index]}
			/>
			{child}
		</frame>
	);
};

export default Item;
