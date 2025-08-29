import React, { forwardRef } from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../../../UIListLayout';

import Categories from './Categories';
import Selection from './Selection';
import Listing from './Listing';

const Accessories = forwardRef<Frame>((_, ref) => {
	const px = usePx();
	
	const pageStyles = Styles.UI.inventory.content.accessories;
	
	return (
		<frame
			ref={ref}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				padding={px(pageStyles.gap)}
				sortByName={false}
			/>
			<Categories
				key={'Categories'}
			/>
			<Listing
				key={'Listing'}
			/>
			<Selection
				key={'Selection'}
			/>
		</frame>
	);
});

export default Accessories;
