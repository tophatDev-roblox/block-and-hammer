import React from '@rbxts/react';

import Speedometer from './Speedometer';
import Altitude from './Altitude';
import MoveHint from './MoveHint';

const HUD: React.FC = () => {
	return (
		<screengui
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 1)}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 0)}
				/>
				<uipadding
					PaddingBottom={new UDim(0, 8)}
				/>
				<MoveHint />
				<Speedometer />
				<Altitude />
			</frame>
		</screengui>
	);
};

export default HUD;
