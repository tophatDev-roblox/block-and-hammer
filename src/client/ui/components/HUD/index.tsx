import React from '@rbxts/react';

import Speedometer from './Speedometer';
import Altitude from './Altitude';
import MoveHint from './MoveHint';

const HudGUI: React.FC = () => {
	return (
		<screengui
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Padding={new UDim(0, 0)}
			/>
			<uipadding
				PaddingTop={new UDim(0, 8)}
				PaddingRight={new UDim(0, 8)}
				PaddingBottom={new UDim(0, 8)}
				PaddingLeft={new UDim(0, 8)}
			/>
			<MoveHint />
			<Speedometer />
			<Altitude />
		</screengui>
	);
};

export default HudGUI;
