import React, { useEffect, useRef } from '@rbxts/react';

import { usePx } from '../hooks/usePx';
import { useStepped } from '../hooks/useStepped';

interface SpinnerProps {
	size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 180 }) => {
	const leftGradientRef = useRef<UIGradient>();
	const rightGradientRef = useRef<UIGradient>();
	
	const px = usePx();
	
	const transparencySequence = new NumberSequence([
		new NumberSequenceKeypoint(0, 0),
		new NumberSequenceKeypoint(0.499, 0),
		new NumberSequenceKeypoint(0.5, 1),
		new NumberSequenceKeypoint(1, 1),
	]);
	
	useEffect(() => {
		const leftGradient = leftGradientRef.current;
		const rightGradient = rightGradientRef.current;
		if (leftGradient === undefined || rightGradient === undefined) {
			return;
		}
		
		const startTime = os.clock();
		
		const disconnectStepped = useStepped(() => {
			const elapsedTime = (os.clock() - startTime) % 2;
			const phase = math.floor(elapsedTime / 0.5);
			const value = (elapsedTime % 0.5) / 0.5;
			const inverseValue = 1 - value;
			
			switch (phase) {
				case 0: {
					leftGradient.Rotation = 180 * value;
					rightGradient.Rotation = 0;
					break;
				}
				case 1: {
					leftGradient.Rotation = 180;
					rightGradient.Rotation = 180 * value;
					break;
				}
				case 2: {
					leftGradient.Rotation = 180 * inverseValue;
					rightGradient.Rotation = 180;
					break;
				}
				case 3: {
					leftGradient.Rotation = 0;
					rightGradient.Rotation = 180 * inverseValue;
					break;
				}
			}
		});
		
		return () => {
			disconnectStepped();
		};
	}, []);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, px(size), 0, px(size))}
		>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0.5, 0, 1, 0)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BorderSizePixel={0}
					Size={new UDim2(2, 0, 1, 0)}
				>
					<uigradient
						ref={leftGradientRef}
						Transparency={transparencySequence}
						Rotation={0}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</frame>
			</frame>
			<frame
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0, 0)}
				Size={new UDim2(0.5, 0, 1, 0)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BorderSizePixel={0}
					Position={new UDim2(-1, 0, 0, 0)}
					Size={new UDim2(2, 0, 1, 0)}
				>
					<uigradient
						ref={rightGradientRef}
						Transparency={transparencySequence}
						Rotation={0}
					/>
					<uicorner
						CornerRadius={new UDim(1, 0)}
					/>
				</frame>
			</frame>
		</frame>
	);
};

export default Spinner;
