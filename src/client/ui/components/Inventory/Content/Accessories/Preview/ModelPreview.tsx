import React, { useEffect, useRef } from '@rbxts/react';

import { ViewportRenderer } from 'shared/viewport-renderer';
import { Accessories } from 'shared/accessories';

interface PreviewProps {
	accessory: Accessories.ModelAccessory;
}

const ModelPreview: React.FC<PreviewProps> = ({ accessory }) => {
	const viewportFrameRef = useRef<ViewportFrame>();
	
	useEffect(() => {
		const viewportFrame = viewportFrameRef.current;
		
		if (viewportFrame === undefined) {
			return;
		}
		
		const renderer = new ViewportRenderer(viewportFrame)
			.move(CFrame.lookAt(new Vector3(0, 0, -15), Vector3.zero))
			.fov(50);
		
		Accessories.getAccessoryModel(accessory.modelName)
			.then((model) => {
				const clone = model.Clone();
				clone.PivotTo(accessory.displayOffset);
				
				renderer.add(clone);
			});
		
		return () => {
			renderer.cleanup();
		};
	}, []);
	
	return (
		<viewportframe
			ref={viewportFrameRef}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		/>
	);
};

export default ModelPreview;
