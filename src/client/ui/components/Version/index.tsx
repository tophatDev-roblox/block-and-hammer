import { RunService } from '@rbxts/services';
import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { TestingPlaceId } from 'shared/constants';
import { Styles } from 'client/styles';
import Text from '../Text';

const VersionGUI: React.FC = () => {
	const styles = useAtom(Styles.stateAtom);
	
	let versionString = `block and hammer v${game.PlaceVersion}`;
	if (RunService.IsStudio()) {
		versionString += ' [dev]';
	} else if (game.PlaceId === TestingPlaceId) {
		versionString += ' [test]';
	}
	
	return (
		<screengui
			DisplayOrder={1}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<uipadding
					PaddingTop={new UDim(0, 4)}
					PaddingRight={new UDim(0, 4)}
				/>
				<Text
					styles={styles.misc.text.version}
					text={versionString}
					alignX={Enum.TextXAlignment.Right}
					automaticHeight
				/>
			</frame>
		</screengui>
	);
};

export default VersionGUI;
