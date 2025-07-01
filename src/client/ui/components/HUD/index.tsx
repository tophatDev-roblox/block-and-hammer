import React from '@rbxts/react';

import { usePx } from 'client/ui/hooks/usePx';
import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Speedometer from './Speedometer';
import Altitude from './Altitude';
import MoveHint from './MoveHint';

const HudGUI: React.FC = () => {
	const px = usePx();
	
	return (
		<screengui
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				alignX={Enum.HorizontalAlignment.Center}
				alignY={Enum.VerticalAlignment.Bottom}
			/>
			<UIPadding
				padding={px(8)}
			/>
			<MoveHint />
			<Speedometer />
			<Altitude />
		</screengui>
	);
};

export default HudGUI;
