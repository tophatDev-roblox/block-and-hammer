import React, { forwardRef } from '@rbxts/react';

import { getAutomaticSize } from 'shared/getAutomaticSize';
import { ContainerStyleData, parseColor } from 'client/stylesParser';
import Gradient from './Gradient';
import Outline from './Outline';

interface ContainerProps extends React.PropsWithChildren {
	styles: ContainerStyleData;
	imageProps?: Partial<ExtractMembers<ImageLabel, any>>;
	width?: UDim;
	height?: UDim;
	automaticWidth?: boolean;
	automaticHeight?: boolean;
}

const Container = forwardRef<ImageLabel, ContainerProps>((props, ref) => {
	const {
		styles: { background, outline },
		imageProps,
		width,
		height,
		automaticWidth = false,
		automaticHeight = false,
		children,
	} = props;
	
	const isRGBA = 'red' in background;
	
	const automaticSize = getAutomaticSize(automaticWidth, automaticHeight);
	
	let labelSize =
		automaticHeight && automaticWidth ? new UDim2(0, 0, 0, 0)
		: automaticHeight ? new UDim2(1, 0, 0, 0)
		: automaticWidth ? new UDim2(0, 0, 1, 0)
		: new UDim2(1, 0, 1, 0);
	
	if (width !== undefined || height !== undefined) {
		labelSize = new UDim2(width ?? labelSize.X, height ?? labelSize.Y);
	}
	
	return (
		<imagelabel
			ref={ref}
			BackgroundTransparency={1}
			Size={labelSize}
			AutomaticSize={automaticSize}
			ImageTransparency={isRGBA ? 1 - background.alpha : 0}
			ImageColor3={isRGBA ? parseColor(background) : Color3.fromRGB(255, 255, 255)}
			{...imageProps}
		>
			{!isRGBA && (
				<Gradient
					styles={background}
				/>
			)}
			{outline !== false && (
				<Outline
					styles={outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			)}
			{children}
		</imagelabel>
	);
});

export default Container;
