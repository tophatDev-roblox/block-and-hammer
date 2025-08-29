import React, { forwardRef } from '@rbxts/react';

const Colors = forwardRef<Frame>((_, ref) => {
	return (
		<frame
			ref={ref}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		>
			
		</frame>
	);
});

export default Colors;
