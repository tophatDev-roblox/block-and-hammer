import React, { forwardRef, useMemo } from '@rbxts/react';

import { TextStyleData } from 'client/stylesParser';
import Gradient from './Gradient';
import Outline from './Outline';

interface TextProps extends React.PropsWithChildren {
	styles: TextStyleData;
	text: string;
	automaticHeight: boolean;
	order?: number;
	alignX?: Enum.TextXAlignment;
	alignY?: Enum.TextYAlignment;
	richText?: boolean;
}

const Text = forwardRef<TextLabel, TextProps>(({ styles: { font, color, size, outline }, text, automaticHeight, order, alignX, alignY, richText, children }, ref) => {
	const fontWeight = useMemo<Enum.FontWeight>(() => {
		for (const weight of Enum.FontWeight.GetEnumItems()) {
			if (weight.Value === font.weight) {
				return weight;
			}
		}
		
		return Enum.FontWeight.Regular;
	}, [font.weight]);
	
	const isRGBA = 'red' in color;
	
	return (
		<textlabel
			ref={ref}
			BackgroundTransparency={1}
			Size={automaticHeight ? new UDim2(1, 0, 0, 0) : new UDim2(1, 0, 1, 0)}
			AutomaticSize={automaticHeight ? Enum.AutomaticSize.Y : Enum.AutomaticSize.None}
			FontFace={new Font(font.fontId, fontWeight, font.italics ? Enum.FontStyle.Italic : Enum.FontStyle.Normal)}
			TextColor3={isRGBA ? Color3.fromRGB(color.red, color.green, color.blue) : Color3.fromRGB(255, 255, 255)}
			TextTransparency={isRGBA ? 1 - color.alpha : 0}
			TextSize={size}
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

