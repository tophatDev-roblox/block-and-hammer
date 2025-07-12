import React from '@rbxts/react';

interface RadialProgressProps {
	rotation: React.Binding<number>;
	transparency?: number | React.Binding<number>;
	color?: Color3 | React.Binding<Color3>;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ rotation, transparency, color }) => {
	const transparencySequence = new NumberSequence([
		new NumberSequenceKeypoint(0, 0),
		new NumberSequenceKeypoint(0.499, 0),
		new NumberSequenceKeypoint(0.5, 1),
		new NumberSequenceKeypoint(1, 1),
	]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		>
			<uiaspectratioconstraint
				AspectRatio={1}
			/>
			<canvasgroup
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.5, 1)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={color ?? Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={transparency ?? 0}
					BorderSizePixel={0}
					Size={UDim2.fromScale(2, 1)}
				>
					<uigradient
						Transparency={transparencySequence}
						Rotation={rotation.map((rotation) => math.min(rotation, 180))}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</frame>
			</canvasgroup>
			<canvasgroup
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.5, 1)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={color ?? Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={transparency ?? 0}
					BorderSizePixel={0}
					Position={UDim2.fromScale(-1, 0)}
					Size={UDim2.fromScale(2, 1)}
				>
					<uigradient
						Transparency={transparencySequence}
						Rotation={rotation.map((rotation) => math.max(rotation, 180))}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</frame>
			</canvasgroup>
		</frame>
	);
};

export default RadialProgress;
