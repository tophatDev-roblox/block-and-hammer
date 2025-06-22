import React from '@rbxts/react';

import { OutlineStyleData, parseColor, parseOutlineJoinMode } from 'client/stylesParser';
import { usePx } from '../hooks/usePx';
import Gradient from './Gradient';

interface OutlineProps {
	styles: OutlineStyleData;
	applyStrokeMode: Enum.ApplyStrokeMode;
}

const Outline: React.FC<OutlineProps> = ({ styles: { color, thickness, joinMode, autoScale }, applyStrokeMode }) => {
	const px = usePx();
	
	const isRGBA = 'red' in color;
	
	return (
		<uistroke
			ApplyStrokeMode={applyStrokeMode}
			Color={isRGBA ? parseColor(color) : Color3.fromRGB(255, 255, 255)}
			Transparency={isRGBA ? 1 - color.alpha : 0}
			Thickness={autoScale === false ? thickness : px(thickness, false)}
			LineJoinMode={parseOutlineJoinMode(joinMode)}
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
