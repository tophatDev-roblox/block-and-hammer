import React from '@rbxts/react';

import Item from './Item';

interface ScrollingItemsProps extends React.PropsWithChildren {
	slope: number;
}

const ScrollingItems: React.FC<ScrollingItemsProps> = ({ slope, children }) => {
	return (
		React.Children.map(children, (child) => (
			<Item
				child={child}
				slope={slope}
			/>
		))
	);
};

export default ScrollingItems;
