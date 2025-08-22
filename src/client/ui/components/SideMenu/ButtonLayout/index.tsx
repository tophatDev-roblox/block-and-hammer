import React from '@rbxts/react';

import Item from './Item';

interface ButtonLayoutProps extends React.PropsWithChildren {
	buttonHeight: number;
	slope: number;
	sideMenuOpen: boolean;
}

const ButtonLayout: React.FC<ButtonLayoutProps> = ({ buttonHeight, slope, sideMenuOpen, children }) => {
	return (
		React.Children.map(children, (child, index) => {
			return (
				<Item
					index={index}
					buttonHeight={buttonHeight}
					slope={slope}
					child={child}
					sideMenuOpen={sideMenuOpen}
				/>
			);
		})
	);
};

export default ButtonLayout;
