import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Accessories } from 'shared/accessories';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIPadding from 'client/ui/components/UIPadding';

import Accessory from './Accessory';

const Listing: React.FC = () => {
	const [items, setItems] = useState<Array<{ accessory: Accessories.BaseAccessory, uid: string }>>([]);
	const [columns] = useState<number>(3);
	
	const boughtAccessories = useAtom(UI.Inventory.boughtAccessoriesAtom);
	const category = useAtom(UI.Inventory.categoryAtom);
	
	const px = usePx();
	
	useEffect(() => {
		const items = new Array<{ accessory: Accessories.BaseAccessory, uid: string }>();
		const promises = new Array<Promise<void>>();
		
		for (const [uid, accessory] of pairs(Accessories.ofCategory(category))) {
			promises.push(new Promise(async (resolve) => {
				const isOwned = await Accessories.doesOwnAccessory(accessory, uid, boughtAccessories);
				
				if (!isOwned) {
					return;
				}
				
				items.push({ uid, accessory });
				
				resolve();
			}));
		}
		
		const promise = Promise.all(promises).then(() => setItems(items));
		
		return () => {
			promise.cancel();
		};
	}, [category, boughtAccessories]);
	
	const pageStyles = Styles.UI.inventory.content.accessories;
	
	return (
		<frame
			{...Styles.applyBackgroundColorProps(pageStyles.listing.background)}
			Size={UDim2.fromScale(0, 1)}
			LayoutOrder={1}
		>
			<uiflexitem
				FlexMode={Enum.UIFlexMode.Grow}
			/>
			<uicorner
				CornerRadius={new UDim(0, px(pageStyles.listing.borderRadius))}
			/>
			<UIPadding
				padding={px(pageStyles.listing.padding)}
			/>
			<scrollingframe
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				ScrollBarThickness={px(pageStyles.listing.scrollbarThickness)}
				CanvasSize={UDim2.fromScale(0, 1)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(px(pageStyles.listing.gap), px(pageStyles.listing.gap))}
					CellSize={new UDim2(1 / columns, px((pageStyles.listing.gap / columns) - pageStyles.listing.gap), 1, 0)}
				>
					<uiaspectratioconstraint
						AspectRatio={0.8}
					/>
				</uigridlayout>
				<uipadding
					PaddingRight={new UDim(0, px(pageStyles.listing.padding + pageStyles.listing.scrollbarThickness))}
				/>
				{items.map(({ accessory, uid }, i) => (
					<Accessory
						accessory={accessory}
						uid={uid}
						order={i}
					/>
				))}
			</scrollingframe>
		</frame>
	);
};

export default Listing;
