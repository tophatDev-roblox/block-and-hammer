import React from '@rbxts/react';

import OriginalButton from 'client/ui/components/Button';

import { usePx } from 'client/ui/hooks/use-px';

import { Styles } from 'client/styles';

import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';
import Outline from 'client/ui/components/Outline';
import Text from 'client/ui/components/Text';

interface ButtonProps {
	style: Omit<Styles.ButtonText, 'icon'>;
	text: string;
	onClick: () => void;
	overrides?: Omit<React.InstanceProps<TextButton>, 'Event'>;
}

const Button: React.FC<ButtonProps> = ({ style, text, onClick, overrides }) => {
	const componentStyles = Styles.UI.inventory.content.accessories.selection.buttons;
	
	const px = usePx();
	
	return (
		<OriginalButton
			{...Styles.applyBackgroundColorProps(style.background)}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Event={{
				MouseButton1Click: () => onClick(),
			}}
			{...overrides}
		>
			{style.background.type === 'gradient' && (
				<Gradient
					styles={style.background}
				/>
			)}
			{style.outline !== undefined && (
				<Outline
					styles={style.outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			)}
			<uicorner
				CornerRadius={new UDim(0, px(componentStyles.borderRadius))}
			/>
			<UIPadding
				padding={style.padding}
			/>
			<Text
				styles={style.text}
				text={text}
				autoHeight
			/>
		</OriginalButton>
	);
};

export default Button;

