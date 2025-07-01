import React, { forwardRef } from '@rbxts/react';

import { getAutomaticSize } from 'shared/getAutomaticSize';
import { Styles, StyleParse } from 'client/styles';
import Gradient from './Gradient';
import Outline from './Outline';

interface ContainerImageProps extends React.PropsWithChildren {
	styles: Styles.Container;
	imageProps?: Partial<ExtractMembers<ImageLabel, any>>;
	width?: UDim;
	height?: UDim;
	automaticWidth?: boolean;
	automaticHeight?: boolean;
}

const ContainerImage = forwardRef<ImageLabel, ContainerImageProps>((props, ref) => {
	const {
		styles: { background, outline },
		imageProps,
		width,
		height,
		automaticWidth = false,
		automaticHeight = false,
		children,
	} = props;
	
	const isRGBA = StyleParse.isRGBA(background);
	
	const automaticSize = getAutomaticSize(automaticWidth, automaticHeight);
	
	let containerSize =
		automaticHeight && automaticWidth ? new UDim2(0, 0, 0, 0)
		: automaticHeight ? new UDim2(1, 0, 0, 0)
		: automaticWidth ? new UDim2(0, 0, 1, 0)
		: new UDim2(1, 0, 1, 0);
	
	if (width !== undefined || height !== undefined) {
		containerSize = new UDim2(width ?? containerSize.X, height ?? containerSize.Y);
	}
	
	return (
		<imagelabel
			ref={ref}
			BackgroundTransparency={1}
			Size={containerSize}
			AutomaticSize={automaticSize}
			ImageTransparency={isRGBA ? 1 - background.alpha : 0}
			ImageColor3={isRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
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

export default ContainerImage;
