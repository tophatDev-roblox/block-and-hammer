import React from '@rbxts/react';
import { useMotion, useMountEffect } from '@rbxts/pretty-react-hooks';

import { Accessories } from 'shared/accessories';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import UIGradient from 'client/ui/components/UIGradient';
import Button from 'client/ui/components/Button';
import Text from 'client/ui/components/Text';

import Preview from '../Preview';

interface AccessoryProps {
	accessory: Accessories.BaseAccessory;
	uid: string;
	index: number;
}

const Accessory: React.FC<AccessoryProps> = ({ accessory, uid, index }) => {
	const px = usePx();
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromOffset(0, px(-70)));
	const [groupTransparency, groupTransparencyMotion] = useMotion<number>(1);
	
	const componentStyles = Styles.UI.inventory.content.accessories.listing.accessory;
	
	useMountEffect(() => {
		const delayTime = (index - 1) * 0.05;
		
		groupTransparencyMotion.tween(0, {
			style: Enum.EasingStyle.Linear,
			time: 0.15,
			delayTime,
		});
		
		positionMotion.tween(UDim2.fromOffset(0, 0), {
			style: Enum.EasingStyle.Bounce,
			direction: Enum.EasingDirection.Out,
			time: 0.5,
			delayTime,
		});
	});
	
	return (
		<frame
			BackgroundTransparency={1}
		>
			<canvasgroup
				BackgroundTransparency={1}
				GroupTransparency={groupTransparency}
				Size={UDim2.fromScale(1, 1)}
				Position={position}
				LayoutOrder={index}
			>
				<Button
					{...Styles.applyBackgroundColorProps(componentStyles.background)}
					Size={UDim2.fromScale(1, 1)}
					Event={{
						MouseButton1Click: () => UI.Inventory.selectAccessoryAtom(accessory, uid),
					}}
				>
					{componentStyles.background.type === 'gradient' && (
						<UIGradient
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
			</canvasgroup>
		</frame>
	);
};

export default Accessory;
