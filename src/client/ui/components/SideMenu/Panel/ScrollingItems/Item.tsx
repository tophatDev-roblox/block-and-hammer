import { RunService } from '@rbxts/services';

import React, { useBinding, useRef } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';

import { usePx } from 'client/ui/hooks/use-px';

interface ItemProps {
	child: React.ReactNode;
	slope: number;
}

const Item: React.FC<ItemProps> = ({ child, slope }) => {
	const frameRef = useRef<Frame>();
	
	const [padding, setPadding] = useBinding<UDim>(new UDim(0, 0));
	
	const px = usePx();
	
	useEventListener(RunService.PreRender, () => {
		const frame = frameRef.current;
		
		if (frame === undefined) {
			return;
		}
		
		setPadding(new UDim(0, frame.AbsolutePosition.Y * slope + px(50)));
	});
	
	return (
		<frame
			ref={frameRef}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
		>
			<uipadding
				PaddingLeft={padding}
			/>
			{child}
		</frame>
	);
};

export default Item;
