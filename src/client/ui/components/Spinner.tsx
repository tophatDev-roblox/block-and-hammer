import { RunService } from '@rbxts/services';
import React, { useBinding, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';

import { TimeSpan } from 'shared/timeSpan';

import { usePx } from 'client/ui/hooks/usePx';

interface SpinnerProps {
	size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 180 }) => {
	const [startTime] = useState<number>(TimeSpan.now());
	
	const [leftRotation, setLeftRotation] = useBinding<number>(0);
	const [rightRotation, setRightRotation] = useBinding<number>(0);
	
	const px = usePx();
	
	const transparencySequence = new NumberSequence([
		new NumberSequenceKeypoint(0, 0),
		new NumberSequenceKeypoint(0.499, 0),
		new NumberSequenceKeypoint(0.5, 1),
		new NumberSequenceKeypoint(1, 1),
	]);
	
	useEventListener(RunService.PreSimulation, () => {
		const time = TimeSpan.now();
		const elapsedTime = (time - startTime) % 2;
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
			Size={UDim2.fromOffset(px(size), px(size))}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.5, 1)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BorderSizePixel={0}
					Size={UDim2.fromScale(2, 1)}
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
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.5, 1)}
				ClipsDescendants
			>
				<frame
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(-1, 0)}
					Size={UDim2.fromScale(2, 1)}
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
