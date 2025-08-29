import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import Immut from '@rbxts/immut';

import { Accessories } from 'shared/accessories';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import UIGradient from 'client/ui/components/UIGradient';
import Text from 'client/ui/components/Text';

import Preview from '../Preview';

import Button from './Button';
import Badge from './Badge';

const Selection: React.FC = () => {
	const equippedAccessories = useAtom(UI.Inventory.temporaryAccessoriesAtom);
	const accessory = useAtom(UI.Inventory.accessoryAtom);
	const uid = useAtom(UI.Inventory.accessoryUidAtom);
	
	const px = usePx();
	
	const componentStyles = Styles.UI.inventory.content.accessories.selection;
	
	return (
		<frame
			{...Styles.applyBackgroundColorProps(componentStyles.background)}
			Size={new UDim2(0, px(400), 1, 0)}
			LayoutOrder={2}
		>
			{componentStyles.background.type === 'gradient' && (
				<UIGradient
					styles={componentStyles.background}
				/>
			)}
			<uicorner
				CornerRadius={new UDim(0, px(componentStyles.borderRadius))}
			/>
			{accessory !== undefined && uid !== undefined && (
				<>
					<UIPadding
						padding={px(componentStyles.padding)}
					/>
					<UIListLayout
						fillDirection={Enum.FillDirection.Vertical}
						gap={px(componentStyles.gap)}
						sortByName={false}
					/>
					<frame
						{...Styles.applyBackgroundColorProps(componentStyles.preview.background)}
						Size={UDim2.fromScale(1, 1)}
						LayoutOrder={0}
					>
						<uicorner
							CornerRadius={new UDim(0, px(componentStyles.preview.borderRadius))}
						/>
						<uiaspectratioconstraint
							AspectRatio={0.9}
						/>
						<Preview
							accessory={accessory}
						/>
					</frame>
					<Text
						key={5}
						styles={componentStyles.name}
						text={accessory.displayName}
						order={1}
						autoHeight
					/>
					<Text
						key={6}
						styles={componentStyles.description}
						text={accessory.description}
						alignX={Enum.TextXAlignment.Left}
						order={2}
						autoHeight
					/>
					<frame
						key={7}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0)}
						LayoutOrder={3}
					>
						<uiflexitem
							FlexMode={Enum.UIFlexMode.Grow}
						/>
					</frame>
					<frame
						key={8}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0)}
						AutomaticSize={Enum.AutomaticSize.Y}
						LayoutOrder={4}
					>
						<UIListLayout
							fillDirection={Enum.FillDirection.Horizontal}
							alignX={Enum.HorizontalAlignment.Center}
							gap={px(componentStyles.badges.gap)}
						/>
						<UIPadding
							padding={px(componentStyles.badges.padding)}
						/>
						{accessory.obtainment.dollars !== undefined && (
							<Badge>
								<>
									<Text
										styles={componentStyles.badges.price.currency}
										text={'$'}
										autoHeight
										autoWidth
									/>
									<Text
										styles={componentStyles.badges.price.amount}
										text={tostring(accessory.obtainment.dollars)}
										autoHeight
										autoWidth
									/>
								</>
							</Badge>
						)}
					</frame>
					{equippedAccessories !== undefined && Accessories.isEquipped(accessory, uid, equippedAccessories) ? (
						<Button
							style={componentStyles.buttons.unequip}
							text={'Unequip'}
							onClick={() => {
								UI.Inventory.temporaryAccessoriesAtom((equippedAccessories) => {
									if (equippedAccessories === undefined) {
										return;
									}
									
									return Immut.produce(equippedAccessories, (draft) => {
										draft.hat.delete(uid);
									});
								});
							}}
							overrides={{
								LayoutOrder: 5,
							}}
						/>
					) : (
						<Button
							style={componentStyles.buttons.equip}
							text={'Equip'}
							onClick={() => {
								UI.Inventory.temporaryAccessoriesAtom((equippedAccessories) => {
									if (equippedAccessories === undefined) {
										return;
									}
									
									return Immut.produce(equippedAccessories, (draft) => {
										draft.hat.add(uid);
									});
								});
							}}
							overrides={{
								LayoutOrder: 5,
							}}
						/>
					)}
				</>
			)}
		</frame>
	);
};

export default Selection;
