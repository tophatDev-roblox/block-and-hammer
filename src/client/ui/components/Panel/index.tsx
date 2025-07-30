import React from '@rbxts/react';

import Settings from './Settings';

const PanelGUI: React.FC = () => {
	return (
		<screengui
			key={'PanelGUI'}
			DisplayOrder={3}
			ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			ResetOnSpawn={false}
			ClipToDeviceSafeArea={false}
			IgnoreGuiInset
		>
			<Settings />
		</screengui>
	);
};

export default PanelGUI;
