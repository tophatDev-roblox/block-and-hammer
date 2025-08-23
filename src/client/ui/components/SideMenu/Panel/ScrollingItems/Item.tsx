import { useMotion } from '@rbxts/pretty-react-hooks';
import React, { useEffect, useRef } from '@rbxts/react';

import { useItemsContext } from 'client/ui/contexts/scrolling-items';

interface ItemProps {
	child: React.ReactNode;
	index: number;
}

const Item: React.FC<ItemProps> = ({ child, index }) => {
	const frameRef = useRef<Frame>();
	const paddingRef = useRef<UIPadding>();
	
	const [padding, paddingMotion] = useMotion<UDim>(new UDim(0, 0));
	
	const { register, unregister } = useItemsContext();
	
	useEffect(() => {
		const frame = frameRef.current;
		const padding = paddingRef.current;
		
		if (frame === undefined || padding === undefined) {
			return;
		}
		
		register({ frame, paddingMotion });
		
		return () => {
			unregister(frame);
		};
	}, []);
	
	return (
		<frame
			ref={frameRef}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			ZIndex={index}
		>
			<uipadding
				ref={paddingRef}
				PaddingLeft={padding}
			/>
			{child}
		</frame>
	);
};

export default Item;
