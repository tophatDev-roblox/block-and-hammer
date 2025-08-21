import React, { forwardRef } from '@rbxts/react';

import { Styles } from 'client/styles';

import { getAutomaticSize } from 'client/ui/get-automatic-size';
import { usePx } from 'client/ui/hooks/use-px';

import Gradient from './Gradient';
import Outline from './Outline';

interface TextProps extends React.PropsWithChildren {
	styles: Styles.Text;
	text: string | React.Binding<string>;
	width?: UDim;
	height?: UDim;
	autoWidth?: boolean;
	autoHeight?: boolean;
	order?: number;
	alignX?: Enum.TextXAlignment;
	alignY?: Enum.TextYAlignment;
	richText?: boolean;
	wrapped?: boolean;
	overrides?: React.InstanceProps<TextLabel>;
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
		autoWidth = false,
		autoHeight = false,
		order = 1,
		alignX = Enum.TextXAlignment.Center,
		alignY = Enum.TextYAlignment.Center,
		richText = false,
		wrapped = false,
		overrides: properties,
		children,
	} = props;
	
	const px = usePx();
	
	const automaticSize = getAutomaticSize(autoWidth, autoHeight);
	
	let labelSize =
		autoHeight && autoWidth ? UDim2.fromScale(0, 0)
		: autoHeight ? UDim2.fromScale(1, 0)
		: autoWidth ? UDim2.fromScale(0, 1)
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
			FontFace={font}
			TextColor3={color.type === 'plain' ? color.color : Color3.fromRGB(255, 255, 255)}
			TextTransparency={color.type === 'plain' ? 1 - (color.alpha ?? 1) : 0}
			TextSize={autoScale === false ? size : px(size)}
			LayoutOrder={order}
			TextXAlignment={alignX}
			TextYAlignment={alignY}
			Text={text}
			TextWrapped={wrapped}
			RichText={richText}
			{...properties}
		>
			{color.type === 'gradient' && (
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

