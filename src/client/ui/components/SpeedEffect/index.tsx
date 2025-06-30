import { GuiService, RunService } from '@rbxts/services';
import React, { useBinding, useRef } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { CharacterState } from 'client/character/state';

const imageIds = [
	'rbxassetid://13484709347',
	'rbxassetid://13484709591',
	'rbxassetid://13484709832',
	'rbxassetid://13484710115',
	'rbxassetid://13484710536',
];

const SpeedEffect: React.FC = () => {
	const [imageId, setImageId] = useBinding<string>(imageIds[0]);
	const [imageTransparency, setImageTransparency] = useBinding<number>(1);
	const [size, setSize] = useBinding<UDim2>(new UDim2(6, 0, 6, 0));
	
	const currentIndexRef = useRef<number>(0);
	
	const characterParts = useAtom(CharacterState.partsAtom);
	
	useEventListener(RunService.RenderStepped, () => {
		if (characterParts === undefined) {
			setImageTransparency(1);
			setSize(new UDim2(6, 0, 6, 0));
			return;
		}
		
		const currentIndex = currentIndexRef.current;
		
		const speed = !GuiService.ReducedMotionEnabled ? 10 : 1;
		const newIndex = math.floor(os.clock() * speed % 4);
		if (newIndex !== currentIndex) {
			setImageId(imageIds[newIndex]);
			currentIndexRef.current = newIndex;
		}
		
		const velocity = characterParts.body.AssemblyLinearVelocity.Magnitude;
		const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
		const size = math.clamp((110 - fieldOfView) / 10, 1.4, 6);
		setImageTransparency(1 - (6 - size) / 4.6);
		setSize(new UDim2(size, 0, size, 0));
	});
	
	return (
		<screengui
			DisplayOrder={-1}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<imagelabel
				BackgroundTransparency={1}
				ImageTransparency={imageTransparency}
				Image={imageId}
				Size={size}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
			/>
		</screengui>
	);
};

export default SpeedEffect;
