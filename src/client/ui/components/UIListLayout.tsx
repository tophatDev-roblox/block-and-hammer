import React from '@rbxts/react';

interface UIListLayoutProps {
	fillDirection: Enum.FillDirection;
	alignX?: Enum.HorizontalAlignment;
	alignY?: Enum.VerticalAlignment;
	flexX?: Enum.UIFlexAlignment;
	flexY?: Enum.UIFlexAlignment;
	gap?: number | UDim;
	sortByName?: boolean;
}

const UIListLayout: React.FC<UIListLayoutProps> = ({ fillDirection, alignX, alignY, flexX, flexY, gap, sortByName = true }) => {
	return (
		<uilistlayout
			FillDirection={fillDirection}
			HorizontalAlignment={alignX}
			HorizontalFlex={flexX}
			VerticalAlignment={alignY}
			VerticalFlex={flexY}
			Padding={typeIs(gap, 'number') ? new UDim(0, gap) : gap}
			SortOrder={sortByName ? Enum.SortOrder.Name : Enum.SortOrder.LayoutOrder}
		/>
	);
};

export default UIListLayout;
