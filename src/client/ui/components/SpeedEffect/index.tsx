import React, { useEffect, useRef } from '@rbxts/react';
import { useStepped } from 'client/ui/hooks/useStepped';

import { useGameContext } from 'client/ui/providers/game';

const imageIds = [
	'rbxassetid://13484709347',
	'rbxassetid://13484709591',
	'rbxassetid://13484709832',
	'rbxassetid://13484710115',
	'rbxassetid://13484710536',
];

const SpeedEffect: React.FC = () => {
	const { character: characterParts } = useGameContext();
	
	const imageLabelRef = useRef<ImageLabel>();
	
	useEffect(() => {
		const imageLabel = imageLabelRef.current;
		if (imageLabel === undefined || characterParts === undefined) {
			return;
		}
		
		let currentIndex = 0;
		
		const disconnectStepped = useStepped(() => {
			const newIndex = math.floor(os.clock() * 10 % 4);
			if (newIndex !== currentIndex) {
				imageLabel.Image = imageIds[newIndex];
				currentIndex = newIndex;
			}
			
			const velocity = characterParts.body.AssemblyLinearVelocity.Magnitude;
			const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
			const size = math.clamp((110 - fieldOfView) / 10, 1.4, 6);
			imageLabel.ImageTransparency = 1 - (6 - size) / 4.6;
			imageLabel.Size = new UDim2(size, 0, size, 0);
		});
		
		return () => {
			disconnectStepped();
		};
	}, [characterParts]);
	
	return (
		<screengui
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<imagelabel
				ref={imageLabelRef}
				Image={imageIds[0]}
				BackgroundTransparency={1}
				ImageTransparency={1}
				Size={new UDim2(6, 0, 6, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
			/>
		</screengui>
	);
};

export default SpeedEffect;
