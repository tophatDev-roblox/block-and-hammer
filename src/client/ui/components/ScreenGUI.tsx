import React from '@rbxts/react';

const ScreenGUI: React.FC<React.InstanceProps<ScreenGui> & React.PropsWithChildren> = (props) => {
	return (
		<screengui
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			ClipToDeviceSafeArea={false}
			ResetOnSpawn={false}
			{...props}
		/>
	);
};

export default ScreenGUI;
