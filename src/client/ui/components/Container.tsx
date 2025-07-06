import React, { forwardRef } from '@rbxts/react';

import { getAutomaticSize } from 'shared/getAutomaticSize';
import { StyleParse, Styles } from 'shared/styles';
import Gradient from './Gradient';
import Outline from './Outline';

interface ContainerProps extends React.PropsWithChildren {
	styles: Styles.Container;
	width?: UDim;
	height?: UDim;
	order?: number;
	automaticWidth?: boolean;
	automaticHeight?: boolean;
	properties?: React.InstanceProps<Frame>;
}

const Container = forwardRef<Frame, ContainerProps>((props, ref) => {
	const {
		styles: { background, outline },
		width,
		height,
		order,
		automaticWidth = false,
		automaticHeight = false,
		properties,
		children,
	} = props;
	
	const automaticSize = getAutomaticSize(automaticWidth, automaticHeight);
	const isRGBA = StyleParse.isRGBA(background);
	
	let containerSize =
		automaticHeight && automaticWidth ? UDim2.fromScale(0, 0)
		: automaticHeight ? UDim2.fromScale(1, 0)
		: automaticWidth ? UDim2.fromScale(0, 1)
		: UDim2.fromScale(1, 1);
	
	if (width !== undefined || height !== undefined) {
		containerSize = new UDim2(width ?? containerSize.X, height ?? containerSize.Y);
	}
	
	return (
		<frame
			ref={ref}
			BackgroundColor3={isRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={isRGBA ? 1 - background.alpha : 0}
			BorderSizePixel={0}
			Size={containerSize}
			AutomaticSize={automaticSize}
			LayoutOrder={order}
			{...properties}
		>
			{!isRGBA && (
				<Gradient
					styles={background}
				/>
			)}
			{outline !== undefined && (
				<Outline
					styles={outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			)}
			{children}
		</frame>
	);
});

export default Container;
