import React, { useEffect, useState } from '@rbxts/react';

import { GradientStyleData } from 'client/stylesParser';

interface GradientProps {
	styles: GradientStyleData;
}

const Gradient: React.FC<GradientProps> = ({ styles: { colors, transparency, rotation } }) => {
	const [colorSequence, setColorSequence] = useState<ColorSequence | undefined>(undefined);
	const [transparencySequence, setTransparencySequence] = useState<NumberSequence | undefined>(undefined);
	
	useEffect(() => { // TODO: validate sequences due to possible error when given invalid sequences
		if (colors === undefined) {
			setColorSequence(undefined);
			return;
		}
		
		const keypoints = new Array<ColorSequenceKeypoint>();
		for (const [time, color] of pairs(colors)) {
			keypoints.push(new ColorSequenceKeypoint(time, Color3.fromRGB(color.red, color.green, color.blue)));
		}
		
		keypoints.sort((a, b) => a.Time < b.Time);
		setColorSequence(new ColorSequence(keypoints));
	}, [colors]);
	
	useEffect(() => {
		if (transparency === undefined) {
			setTransparencySequence(undefined);
			return;
		}
		
		const keypoints = new Array<NumberSequenceKeypoint>();
		for (const [time, color] of pairs(transparency)) {
			keypoints.push(new NumberSequenceKeypoint(time, color));
		}
		
		keypoints.sort((a, b) => a.Time < b.Time);
		setTransparencySequence(new NumberSequence(keypoints));
	}, [transparency]);
	
	return (
		<uigradient
			Color={colorSequence}
			Transparency={transparencySequence}
			Rotation={rotation}
		/>
	);
};

export default Gradient;

