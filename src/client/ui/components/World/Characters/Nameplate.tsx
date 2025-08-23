import { Players } from '@rbxts/services';

import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Atom } from '@rbxts/charm';

import { InputType } from 'shared/input-type';

import { Styles } from 'client/styles';

import { CharacterState } from 'client/character/state';

import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../../UIListLayout';
import Text from '../../Text';

const client = Players.LocalPlayer;

interface NameplateProps {
	player: Player;
	partsAtom: Atom<CharacterState.Parts | undefined>;
	inputTypeAtom: Atom<InputType>;
}

const Nameplate: React.FC<NameplateProps> = ({ player, partsAtom }) => {
	const characterParts = useAtom(partsAtom);
	
	const px = usePx();
	
	if (characterParts === undefined || player === client) {
		return;
	}
	
	const hideOthersTransparency = tonumber(characterParts.body.GetAttribute('hideOthersTransparency')) ?? 0;
	
	if (hideOthersTransparency >= 1) {
		return;
	}
	
	return (
		<billboardgui
			Adornee={characterParts.body}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			StudsOffset={new Vector3(0, 4, 0)}
			Size={UDim2.fromOffset(px(800), px(300))}
			AlwaysOnTop
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Vertical}
				alignY={Enum.VerticalAlignment.Center}
				padding={px(Styles.UI.world.nameplate.listPadding)}
			/>
			<Text
				styles={Styles.UI.world.nameplate.displayName}
				text={player.DisplayName}
				autoHeight
			/>
			<Text
				styles={Styles.UI.world.nameplate.username}
				text={'@' + player.Name}
				autoHeight
			/>
		</billboardgui>
	);
};

export default Nameplate;
