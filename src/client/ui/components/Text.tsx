import React, { forwardRef, useMemo } from '@rbxts/react';

import { Styles, StyleParse } from 'shared/styles';
import { getAutomaticSize } from 'shared/getAutomaticSize';

import { usePx } from 'client/ui/hooks/usePx';

import Gradient from './Gradient';
import Outline from './Outline';

interface TextProps extends React.PropsWithChildren {
	styles: Styles.Text;
	text: React.Binding<string> | string;
	width?: UDim;
	height?: UDim;
	automaticWidth?: boolean;
	automaticHeight?: boolean;
	order?: number;
	alignX?: Enum.TextXAlignment;
	alignY?: Enum.TextYAlignment;
	richText?: boolean;
	wrapped?: boolean;
	properties?: React.InstanceProps<TextLabel>;
}

const Text = forwardRef<TextLabel, TextProps>((props, ref) => {
	const {
		styles: {
			font,
			color,
			size,
			outline,
			autoScale,
		},
		text,
		width,
		height,
		automaticWidth = false,
		automaticHeight = false,
		order = 1,
		alignX = Enum.TextXAlignment.Center,
		alignY = Enum.TextYAlignment.Center,
		richText = false,
		wrapped = false,
		properties,
		children,
	} = props;
	
	const fontFace = useMemo<Font>(() => StyleParse.font(font), [font]);
	
	const px = usePx();
	
	const automaticSize = getAutomaticSize(automaticWidth, automaticHeight);
	const isRGBA = StyleParse.isRGBA(color);
	
	let labelSize =
		automaticHeight && automaticWidth ? UDim2.fromScale(0, 0)
		: automaticHeight ? UDim2.fromScale(1, 0)
		: automaticWidth ? UDim2.fromScale(0, 1)
		: UDim2.fromScale(1, 1);
	
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
			TextWrapped={wrapped}
			RichText={richText}
			{...properties}
		>
			{!isRGBA && (
				<Gradient
					styles={color}
				/>
			)}
			{outline !== undefined && (
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

