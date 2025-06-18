import { RunService } from '@rbxts/services';
import React from '@rbxts/react';

import { TestingPlaceId } from 'shared/constants';
import { useGameContext } from 'client/ui/gameProvider/context';
import Text from '../Text';

const Version: React.FC = () => {
	const { styles } = useGameContext();
	
	let versionString = `block and hammer v${game.PlaceVersion}`;
	if (RunService.IsStudio()) {
		versionString = 'block and hammer [dev]';
	} else if (game.PlaceId === TestingPlaceId) {
		versionString += ' [test]';
	}
	
	return (
		<screengui
			ResetOnSpawn={false}
		>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<uipadding
					PaddingBottom={new UDim(0, 4)}
					PaddingRight={new UDim(0, 2)}
				/>
				<Text
					styles={styles.text.version}
					text={versionString}
					alignX={Enum.TextXAlignment.Right}
					automaticHeight={true}
				/>
			</frame>
		</screengui>
	);
};

export default Version;
