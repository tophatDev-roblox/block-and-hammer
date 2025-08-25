import React from '@rbxts/react';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';

import Gradient from '../../Gradient';

const Content: React.FC = () => {
	const px = usePx();
	
	const contentStyles = Styles.UI.inventory.content;
	
	return (
		<frame
			{...Styles.applyBackgroundColorProps(contentStyles.background)}
			Size={UDim2.fromScale(1, 0)}
		>
			<uicorner
				CornerRadius={new UDim(0, px(20))}
			/>
			{contentStyles.background.type === 'gradient' && (
				<Gradient
					styles={contentStyles.background}
				/>
			)}
			<uiflexitem
				FlexMode={Enum.UIFlexMode.Grow}
			/>
		</frame>
	);
};

export default Content;
