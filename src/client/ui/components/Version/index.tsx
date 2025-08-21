import { RunService } from '@rbxts/services';

import React from '@rbxts/react';

import { Constants } from 'shared/constants';

import { Styles } from 'client/styles';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIPadding from '../UIPadding';
import ScreenGUI from '../ScreenGUI';
import Text from '../Text';

const Version: React.FC = () => {
	const px = usePx();
	
	let text = `block and hammer v${game.PlaceVersion}`;
	
	if (RunService.IsStudio()) {
		text += ' [dev]';
	} else if (game.PlaceId === Constants.TestingPlaceId) {
		text += ' [test]';
	}
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.Version}
			IgnoreGuiInset
		>
			<UIPadding
				padding={px(3)}
			/>
			<Text
				text={text}
				styles={Styles.UI.version}
				alignX={Enum.TextXAlignment.Right}
				autoHeight
			/>
		</ScreenGUI>
	);
};

export default Version;
