import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import Gradient from './Gradient';

interface OutlineProps {
	styles: Styles.Outline;
	applyStrokeMode: Enum.ApplyStrokeMode;
	overrides?: React.InstanceProps<UIStroke>;
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
		overrides,
	} = props;
	
	const px = usePx();
	
	return (
		<uistroke
			ApplyStrokeMode={applyStrokeMode}
			Color={color.type === 'plain' ? color.color : Color3.fromRGB(255, 255, 255)}
			Transparency={color.type === 'plain' ? 1 - (color.alpha ?? 1) : 0}
			Thickness={autoScale ? px(thickness, false) : thickness}
			LineJoinMode={joinMode}
			{...overrides}
		>
			{color.type === 'gradient' && (
				<Gradient
					styles={color}
				/>
			)}
		</uistroke>
	);
};

export default Outline;
