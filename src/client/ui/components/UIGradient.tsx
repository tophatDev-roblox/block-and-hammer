import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Styles } from 'client/styles';

interface GradientProps {
	styles: Styles.Gradient;
}

const UIGradient: React.FC<GradientProps> = ({ styles }) => {
	const [rotation, rotationMotion] = useMotion<number>(styles.rotationsPerSecond === undefined ? (styles.rotation ?? 0) : 0);
	
	useEffect(() => {
		if (styles.rotationsPerSecond === undefined) {
			rotationMotion.set(styles.rotation ?? 0);
		} else {
			rotationMotion.set(0);
			
			rotationMotion.tween(360, {
				time: 1 / styles.rotationsPerSecond,
				style: Enum.EasingStyle.Linear,
				repeatCount: -1,
			});
		}
	}, [styles.rotation, styles.rotationsPerSecond]);
	
	return (
		<uigradient
			Color={styles.color}
			Transparency={styles.transparency}
			Rotation={rotation}
		/>
	);
};

export default UIGradient;

