import React from '@rbxts/react';

import Characters from './Characters';

const World: React.FC = () => {
	return (
		<folder>
			<Characters
				key={'Characters'}
			/>
		</folder>
	);
};

export default World;
