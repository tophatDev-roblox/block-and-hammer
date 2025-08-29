import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => {
	const px = usePx();
	
	const componentStyles = Styles.UI.inventory.content.accessories.selection.badges.badge;
	
	return (
		<frame
			{...Styles.applyBackgroundColorProps(componentStyles.background)}
			Size={UDim2.fromScale(0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
		>
			{componentStyles.background.type === 'gradient' && (
				<Gradient
					styles={componentStyles.background}
				/>
			)}
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				alignY={Enum.VerticalAlignment.Center}
				padding={px(componentStyles.gap)}
			/>
			<UIPadding
				padding={px(componentStyles.padding)}
			/>
			<uicorner
				CornerRadius={new UDim(0, componentStyles.borderRadius)}
			/>
			{children}
		</frame>
	);
};

export default Badge;
