import React, { useEffect, useState } from '@rbxts/react';

import { GradientStyleData } from 'client/stylesParser';

interface GradientProps {
	styles: GradientStyleData;
}

const Gradient: React.FC<GradientProps> = ({ styles: { colors, transparency, rotation } }) => {
	const [colorSequence, setColorSequence] = useState<ColorSequence | undefined>(undefined);
	const [transparencySequence, setTransparencySequence] = useState<NumberSequence | undefined>(undefined);
	
	useEffect(() => {
		if (colors === undefined) {
			setColorSequence(undefined);
			return;
		}
		
		const keypoints = new Array<ColorSequenceKeypoint>();
		for (const [time, color] of pairs(colors)) {
			keypoints.push(new ColorSequenceKeypoint(time, Color3.fromRGB(color.red, color.green, color.blue)));
		}
		
		keypoints.sort((a, b) => a.Time < b.Time);
		if (keypoints.size() >= 2 && keypoints[0].Time === 0 && keypoints[keypoints.size() - 1].Time === 1) {
			setColorSequence(new ColorSequence(keypoints));
		} else {
			warn('[styleData::Gradient] color must have at least 2 keypoints, start at 0 and end at 1');
			setColorSequence(new ColorSequence(Color3.fromRGB(255, 0, 255)));
		}
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
		if (keypoints.size() >= 2 && keypoints[0].Time === 0 && keypoints[keypoints.size() - 1].Time === 1) {
			setTransparencySequence(new NumberSequence(keypoints));
		} else {
			warn('[styleData::Gradient] transparency must have at least 2 keypoints, start at 0 and end at 1');
			setTransparencySequence(new NumberSequence(0.5));
		}
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

