import { GuiService, RunService } from '@rbxts/services';

import React, { useBinding, useRef } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { TimeSpan } from 'shared/timeSpan';

import { CharacterState } from 'client/character/state';

const imageIds = [
	'rbxassetid://13484709347',
	'rbxassetid://13484709591',
	'rbxassetid://13484709832',
	'rbxassetid://13484710115',
	'rbxassetid://13484710536',
];

const SpeedEffectGUI: React.FC = () => {
	const [imageId, setImageId] = useBinding<string>(imageIds[0]);
	const [imageTransparency, setImageTransparency] = useBinding<number>(1);
	const [size, setSize] = useBinding<UDim2>(UDim2.fromScale(6, 6));
	
	const currentIndexRef = useRef<number>(0);
	
	const characterParts = useAtom(CharacterState.partsAtom);
	
	useEventListener(RunService.PreRender, () => {
		const time = TimeSpan.now();
		if (characterParts === undefined) {
			setImageTransparency(1);
			setSize(UDim2.fromScale(6, 6));
			return;
		}
		
		const currentIndex = currentIndexRef.current;
		
		const speed = !GuiService.ReducedMotionEnabled ? 10 : 1;
		const newIndex = math.floor(time * speed % 4);
		if (newIndex !== currentIndex) {
			setImageId(imageIds[newIndex]);
			currentIndexRef.current = newIndex;
		}
		
		const velocity = characterParts.body.AssemblyLinearVelocity.Magnitude;
		const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
		const size = math.clamp((110 - fieldOfView) / 10, 1.4, 6);
		setImageTransparency(1 - (6 - size) / 4.6);
		setSize(UDim2.fromScale(size, size));
	});
	
	return (
		<screengui
			key={'SpeedEffectGUI'}
			DisplayOrder={-1}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<imagelabel
				BackgroundTransparency={1}
				ImageTransparency={imageTransparency}
				Image={imageId}
				Size={size}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			/>
		</screengui>
	);
};

export default SpeedEffectGUI;
