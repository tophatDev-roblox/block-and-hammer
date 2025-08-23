import React, { useEffect, useRef } from '@rbxts/react';

import { setTimeout } from '@rbxts/set-timeout';

import { ItemRegistry, ItemsContext } from 'client/ui/contexts/scrolling-items';
import { usePx } from 'client/ui/hooks/use-px';

import Item from './Item';

interface ScrollingItemsProps extends React.PropsWithChildren {
	slope: number;
	scrollingFrameRef: React.RefObject<ScrollingFrame>;
}

const ScrollingItems: React.FC<ScrollingItemsProps> = ({ slope, scrollingFrameRef, children }) => {
	const items = useRef<Array<ItemRegistry>>([]);
	
	const px = usePx();
	
	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.current;
		
		if (scrollingFrame === undefined) {
			return;
		}
		
		const onScroll = () => {
			for (const { frame, paddingMotion } of items.current) {
				const yPosition = frame.AbsolutePosition.Y;
				const padding = yPosition * slope + px(50);
				
				paddingMotion.spring(new UDim(0, padding), {
					tension: 60 + math.clamp(yPosition / frame.AbsoluteSize.Y * 10, 0, 80),
					friction: 8,
				});
			}
		};
		
		setTimeout(onScroll, 0.2);
		
		const connection = scrollingFrame.GetPropertyChangedSignal('CanvasPosition').Connect(onScroll);
		
		return () => {
			connection.Disconnect();
		};
	}, [slope]);
	
	const register = (item: ItemRegistry) => {
		items.current.push(item);
	};
	
	const unregister = (frame: Frame) => {
		items.current = items.current.filter((item) => item.frame !== frame);
	};
	
	return (
		<ItemsContext.Provider
			value={{ register, unregister }}
		>
			{React.Children.map(children, (child, i) => (
				<Item
					key={i}
					child={child}
					index={-i}
				/>
			))}
		</ItemsContext.Provider>
	);
};

export default ScrollingItems;
