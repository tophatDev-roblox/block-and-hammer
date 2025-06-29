import { RunService } from '@rbxts/services';
import React, { useBinding, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';

import { usePx } from '../hooks/usePx';

interface SpinnerProps {
	size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 180 }) => {
	const [startTime] = useState<number>(os.clock());
	
	const [leftRotation, setLeftRotation] = useBinding<number>(0);
	const [rightRotation, setRightRotation] = useBinding<number>(0);
	
	const px = usePx();
	
	const transparencySequence = new NumberSequence([
		new NumberSequenceKeypoint(0, 0),
		new NumberSequenceKeypoint(0.499, 0),
		new NumberSequenceKeypoint(0.5, 1),
		new NumberSequenceKeypoint(1, 1),
	]);
	
	useEventListener(RunService.Stepped, () => {
		const elapsedTime = (os.clock() - startTime) % 2;
		const phase = math.floor(elapsedTime / 0.5);
		const value = (elapsedTime % 0.5) / 0.5;
		const inverseValue = 1 - value;
		
		switch (phase) {
			case 0: {
				setLeftRotation(180 * value);
				setRightRotation(0);
				break;
			}
			case 1: {
				setLeftRotation(180);
				setRightRotation(180 * value);
				break;
			}
			case 2: {
				setLeftRotation(180 * inverseValue);
				setRightRotation(180);
				break;
			}
			case 3: {
				setLeftRotation(0);
				setRightRotation(180 * inverseValue);
				break;
			}
		}
	});
	
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
						Transparency={transparencySequence}
						Rotation={leftRotation}
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
						Transparency={transparencySequence}
						Rotation={rightRotation}
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
