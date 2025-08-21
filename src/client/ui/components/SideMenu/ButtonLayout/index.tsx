import React from '@rbxts/react';

import Item from './Item';

interface ButtonLayoutProps extends React.PropsWithChildren {
	buttonHeight: number;
	padding: number;
	sideMenuOpen: boolean;
}

const ButtonLayout: React.FC<ButtonLayoutProps> = ({ buttonHeight, padding, sideMenuOpen, children }) => {
	return (
		React.Children.map(children, (child, index) => {
			return (
				<Item
					index={index}
					buttonHeight={buttonHeight}
					paddingChange={padding}
					child={child}
					sideMenuOpen={sideMenuOpen}
				/>
			);
		})
	);
};

export default ButtonLayout;
