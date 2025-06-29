import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles, StyleParse } from 'client/styles';
import { usePx } from '../hooks/usePx';
import Gradient from './Gradient';
interface OutlineProps {
	styles: Styles.Outline;
	applyStrokeMode: Enum.ApplyStrokeMode;
	overwriteThickness?: number;
}

const Outline: React.FC<OutlineProps> = ({ styles: { color, thickness, joinMode, autoScale = true }, applyStrokeMode, overwriteThickness }) => {
	const px = usePx();
	const [thicknessValue, thicknessMotion] = useMotion(0);
	
	const isRGBA = 'red' in color;
	
	useEffect(() => {
		thicknessMotion.tween(overwriteThickness ?? (autoScale ? px(thickness, false) : thickness), {
			time: 0.2,
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.Out,
		});
	}, [thickness, overwriteThickness]);
	
	return (
		<uistroke
			ApplyStrokeMode={applyStrokeMode}
			Color={isRGBA ? StyleParse.color(color) : Color3.fromRGB(255, 255, 255)}
			Transparency={isRGBA ? 1 - color.alpha : 0}
			Thickness={thicknessValue}
			LineJoinMode={StyleParse.outlineJoinMode(joinMode)}
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
