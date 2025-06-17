import React from '@rbxts/react';

import { OutlineStyleData } from 'client/stylesParser';
import Gradient from './Gradient';

interface OutlineProps {
	styles: OutlineStyleData;
	applyStrokeMode: Enum.ApplyStrokeMode;
}

const Outline: React.FC<OutlineProps> = ({ styles: { color, thickness, joinMode }, applyStrokeMode }) => {
	const isRGBA = 'red' in color;
	
	return (
		<uistroke
			ApplyStrokeMode={applyStrokeMode}
			Color={isRGBA ? Color3.fromRGB(color.red, color.green, color.blue) : Color3.fromRGB(255, 255, 255)}
			Transparency={isRGBA ? 1 - color.alpha : 0}
			Thickness={thickness}
			LineJoinMode={joinMode === 'miter' ? Enum.LineJoinMode.Miter : joinMode === 'round' ? Enum.LineJoinMode.Round : Enum.LineJoinMode.Bevel}
		>
			{!isRGBA && (
				<Gradient
					styles={color}
				/>
			)}
		</uistroke>
	);
};

export default Outline;
