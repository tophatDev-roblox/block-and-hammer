import React from '@rbxts/react';

interface UIPaddingProps {
	padding: number | [number, number] | [number, number, number, number];
	overrides?: React.InstanceProps<UIPadding>;
}

const UIPadding: React.FC<UIPaddingProps> = ({ padding, overrides }) => {
	if (typeIs(padding, 'number')) {
		return (
			<uipadding
				PaddingTop={new UDim(0, padding)}
				PaddingRight={new UDim(0, padding)}
				PaddingBottom={new UDim(0, padding)}
				PaddingLeft={new UDim(0, padding)}
				{...overrides}
			/>
		);
	} else if (padding.size() === 2) {
		return (
			<uipadding
				PaddingTop={new UDim(0, padding[0])}
				PaddingRight={new UDim(0, padding[1])}
				PaddingBottom={new UDim(0, padding[0])}
				PaddingLeft={new UDim(0, padding[1])}
				{...overrides}
			/>
		);
	}
	
	return (
		<uipadding
			PaddingTop={new UDim(0, padding[0])}
			PaddingRight={new UDim(0, padding[1])}
			PaddingBottom={new UDim(0, padding[2])}
			PaddingLeft={new UDim(0, padding[3])}
			{...overrides}
		/>
	);
};

export default UIPadding;
