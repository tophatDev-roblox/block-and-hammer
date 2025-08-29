import React from '@rbxts/react';

import { Accessories } from 'shared/accessories';
import { Assets } from 'shared/assets';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';

import Category from './Category';

const Categories: React.FC = () => {
	const px = usePx();
	
	const pageStyles = Styles.UI.inventory.content.accessories;
	
	return (
		<frame
			{...Styles.applyBackgroundColorProps(pageStyles.categories.background)}
			Size={new UDim2(0, px(130), 1, 0)}
			LayoutOrder={0}
		>
			{pageStyles.categories.background.type === 'gradient' && (
				<Gradient
					styles={pageStyles.categories.background}
				/>
			)}
			<uicorner
				CornerRadius={new UDim(0, px(pageStyles.categories.borderRadius))}
			/>
			<UIPadding
				padding={px(pageStyles.categories.padding)}
			/>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				padding={px(pageStyles.categories.gap)}
			/>
			<Category
				icon={Assets.Icons.CategoryHat}
				category={Accessories.Category.Hats}
				iconScale={0.9}
			/>
			<Category
				icon={''}
				category={Accessories.Category.Eyes}
			/>
			<Category
				icon={''}
				category={Accessories.Category.Mouth}
			/>
		</frame>
	);
};

export default Categories;
