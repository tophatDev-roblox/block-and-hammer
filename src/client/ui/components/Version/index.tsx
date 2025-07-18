import { RunService } from '@rbxts/services';

import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Styles } from 'shared/styles';

import { TestingPlaceId } from 'shared/constants';
import { usePx } from 'client/ui/hooks/use-px';

import UIPadding from '../UIPadding';
import Text from '../Text';

const VersionGUI: React.FC = () => {
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	let versionString = `block and hammer v${game.PlaceVersion}`;
	if (RunService.IsStudio()) {
		versionString += ' [dev]';
	} else if (game.PlaceId === TestingPlaceId) {
		versionString += ' [test]';
	}
	
	return (
		<screengui
			key={'VersionGUI'}
			DisplayOrder={1}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<UIPadding
					padding={[px(4), px(4), 0, 0]}
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
