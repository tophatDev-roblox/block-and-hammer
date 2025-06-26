import React, { forwardRef, useMemo } from '@rbxts/react';

import { parseFontStyle, TextStyleData } from 'client/stylesParser';
import { usePx } from '../hooks/usePx';
import Gradient from './Gradient';
import Outline from './Outline';
import { getAutomaticSize } from 'shared/getAutomaticSize';

interface TextProps extends React.PropsWithChildren {
	styles: TextStyleData;
	text: string;
	width?: UDim;
	height?: UDim;
	automaticHeight?: boolean;
	automaticWidth?: boolean;
	order?: number;
	alignX?: Enum.TextXAlignment;
	alignY?: Enum.TextYAlignment;
	richText?: boolean;
}

const Text = forwardRef<TextLabel, TextProps>((props, ref) => {
	const {
		styles: { font, color, size, outline, autoScale },
		text,
		width,
		height,
		automaticHeight = false,
		automaticWidth = false,
		order = 1,
		alignX = Enum.TextXAlignment.Center,
		alignY = Enum.TextYAlignment.Center,
		richText = false,
		children,
	} = props;
	
	const px = usePx();
	
	const fontFace = useMemo<Font>(() => parseFontStyle(font), [font]);
	
	const isRGBA = 'red' in color;
	
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
		<textlabel
			ref={ref}
			BackgroundTransparency={1}
			Size={labelSize}
			AutomaticSize={automaticSize}
			FontFace={fontFace}
			TextColor3={isRGBA ? Color3.fromRGB(color.red, color.green, color.blue) : Color3.fromRGB(255, 255, 255)}
			TextTransparency={isRGBA ? 1 - color.alpha : 0}
			TextSize={autoScale === false ? size : px(size)}
			LayoutOrder={order}
			TextXAlignment={alignX}
			TextYAlignment={alignY}
			Text={text}
			RichText={richText}
		>
			{!isRGBA && (
				<Gradient
					styles={color}
				/>
			)}
			{outline && (
				<Outline
					styles={outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Contextual}
				/>
			)}
			{children}
		</textlabel>
	);
});

export default Text;

