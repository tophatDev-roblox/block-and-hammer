import React from '@rbxts/react';

import { Accessories } from 'shared/accessories';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';
import Button from 'client/ui/components/Button';
import Text from 'client/ui/components/Text';

import Preview from '../Preview';

interface AccessoryProps {
	accessory: Accessories.BaseAccessory;
	uid: string;
	order: number;
}

const Accessory: React.FC<AccessoryProps> = ({ accessory, uid, order }) => {
	const px = usePx();
	
	const componentStyles = Styles.UI.inventory.content.accessories.listing.accessory;
	
	return (
		<Button
			{...Styles.applyBackgroundColorProps(componentStyles.background)}
			key={order}
			Event={{
				MouseButton1Click: () => UI.Inventory.selectAccessoryAtom(accessory, uid),
			}}
		>
			{componentStyles.background.type === 'gradient' && (
				<Gradient
					styles={componentStyles.background}
				/>
			)}
			<uicorner
				CornerRadius={new UDim(0, px(componentStyles.borderRadius))}
			/>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				gap={px(componentStyles.gap)}
			/>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
			>
				<uiflexitem
					FlexMode={Enum.UIFlexMode.Shrink}
				/>
				<Preview
					accessory={accessory}
				/>
			</frame>
			<frame
				{...Styles.applyBackgroundColorProps(componentStyles.info.background)}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<uicorner
					CornerRadius={new UDim(0, px(componentStyles.borderRadius))}
				/>
				<UIPadding
					padding={px(componentStyles.info.padding)}
				/>
				<Text
					styles={componentStyles.info.text}
					text={accessory.displayName}
					autoHeight
				/>
			</frame>
		</Button>
	);
};

export default Accessory;
