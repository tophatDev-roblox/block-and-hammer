import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles, StyleParse } from 'client/styles';

interface GradientProps {
	styles: Styles.Gradient;
}

const Gradient: React.FC<GradientProps> = ({ styles: gradient }) => {
	const [colorSequence, setColorSequence] = useState<ColorSequence | undefined>(undefined);
	const [transparencySequence, setTransparencySequence] = useState<NumberSequence | undefined>(undefined);
	
	const [rotation, rotationMotion] = useMotion<number>(typeIs(gradient.rotation, 'number') ? gradient.rotation : 0);
	
	useEffect(() => {
		const [colorSequence, transparencySequence] = StyleParse.gradient(gradient);
		
		setColorSequence(colorSequence);
		setTransparencySequence(transparencySequence);
	}, [gradient.colors, gradient.transparency]);
	
	useEffect(() => {
		if (typeIs(gradient.rotation, 'number')) {
			rotationMotion.set(gradient.rotation);
		} else {
			rotationMotion.set(0);
			rotationMotion.tween(360, {
				time: 1 / gradient.rotation.rotationsPerSecond,
				style: Enum.EasingStyle.Linear,
				repeatCount: -1,
			});
		}
	}, [gradient.rotation]);
	
	return (
		<uigradient
			Color={colorSequence}
			Transparency={transparencySequence}
			Rotation={rotation}
		/>
	);
};

export default Gradient;

