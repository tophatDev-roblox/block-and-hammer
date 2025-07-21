import React from '@rbxts/react';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';

import StatusEffects from './StatusEffects';
import Speedometer from './Speedometer';
import Altitude from './Altitude';
import MoveHint from './MoveHint';

const HudGUI: React.FC = () => {
	const px = usePx();
	
	return (
		<screengui
			key={'HudGUI'}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				alignX={Enum.HorizontalAlignment.Center}
				alignY={Enum.VerticalAlignment.Bottom}
				padding={px(6)}
			/>
			<UIPadding
				padding={px(8)}
			/>
			<MoveHint />
			<StatusEffects />
			<Speedometer />
			<Altitude />
		</screengui>
	);
};

export default HudGUI;
