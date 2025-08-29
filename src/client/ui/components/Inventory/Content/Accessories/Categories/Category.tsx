import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { batch } from '@rbxts/charm';

import Ripple from '@rbxts/ripple';

import { Accessories } from 'shared/accessories';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';
import Button from 'client/ui/components/Button';

interface CategoryProps {
	category: Accessories.Category;
	icon: string;
	iconScale?: number;
}

const Category: React.FC<CategoryProps> = ({ category, icon, iconScale = 1 }) => {
	const [selectedBackgroundTransparency, selectedBackgroundMotionTransparency] = useMotion<number>(1);
	
	const currentCategory = useAtom(UI.Inventory.categoryAtom);
	
	const px = usePx();
	
	const categoryStyles = Styles.UI.inventory.content.accessories.categories.category;
	
	useEffect(() => {
		const options: Ripple.TweenOptions = {
			style: Enum.EasingStyle.Linear,
			time: 0.1,
		};
		
		if (currentCategory === category) {
			selectedBackgroundMotionTransparency.tween(1 - categoryStyles.selected.background.alpha, options);
		} else {
			selectedBackgroundMotionTransparency.tween(1, options);
		}
	}, [currentCategory]);
	
	return (
		<Button
			{...Styles.applyBackgroundColorProps(categoryStyles.background)}
			Size={UDim2.fromScale(1, 1)}
			Event={{
				MouseButton1Click: () => batch(() => {
					UI.Inventory.categoryAtom(category);
					UI.Inventory.unselectAccessoryAtom();
				}),
			}}
		>
			{categoryStyles.background.type === 'gradient' && (
				<Gradient
					styles={categoryStyles.background}
				/>
			)}
			<UIPadding
				padding={px(categoryStyles.padding)}
			/>
			<uiaspectratioconstraint
				AspectRatio={1}
			/>
			<uicorner
				CornerRadius={new UDim(0, px(categoryStyles.borderRadius))}
			/>
			<frame
				{...Styles.applyBackgroundColorProps(categoryStyles.selected.background)}
				BackgroundTransparency={selectedBackgroundTransparency}
				Size={UDim2.fromScale(1, 1)}
			>
				<uicorner
					CornerRadius={new UDim(0, px(categoryStyles.selected.borderRadius))}
				/>
				<imagelabel
					{...Styles.applyImageColorProps(categoryStyles.icon)}
					Image={icon}
					Size={UDim2.fromScale(iconScale, iconScale)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					{categoryStyles.icon.type === 'gradient' && (
						<Gradient
							styles={categoryStyles.icon}
						/>
					)}
				</imagelabel>
			</frame>
		</Button>
	);
};

export default Category;
