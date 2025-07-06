import React from '@rbxts/react';

import { Styles, StyleParse } from 'shared/styles';
import { usePx } from '../hooks/usePx';
import Gradient from './Gradient';

interface OutlineProps {
	styles: Styles.Outline;
	applyStrokeMode: Enum.ApplyStrokeMode;
	properties?: React.InstanceProps<UIStroke>;
}

const Outline: React.FC<OutlineProps> = (props) => {
	const {
		styles: {
			color,
			thickness,
			joinMode,
			autoScale = true,
		},
		applyStrokeMode,
		properties,
	} = props;
	
	const px = usePx();
	
	const isRGBA = StyleParse.isRGBA(color);
	
	return (
		<uistroke
			ApplyStrokeMode={applyStrokeMode}
			Color={isRGBA ? StyleParse.color(color) : Color3.fromRGB(255, 255, 255)}
			Transparency={isRGBA ? 1 - color.alpha : 0}
			Thickness={autoScale ? px(thickness, false) : thickness}
			LineJoinMode={StyleParse.outlineJoinMode(joinMode)}
			{...properties}
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
