import { Players } from '@rbxts/services';

import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { effect } from '@rbxts/charm';

import { StyleParse, Styles } from 'shared/styles';
import { InputType } from 'shared/inputType';
import { Assets } from 'shared/assets';

import { OtherCharacters } from 'client/otherCharacters';
import { usePx } from 'client/ui/hooks/usePx';

import UIListLayout from '../UIListLayout';
import Text from '../Text';

const client = Players.LocalPlayer;

const inputTypeImageMap = new Map<InputType, Assets.Icons>([
	[InputType.Desktop, Assets.Icons.DesktopIcon],
	[InputType.Touch, Assets.Icons.MobileIcon],
	[InputType.Controller, Assets.Icons.ControllerIcon],
]);

const Characters: React.FC = () => {
	const [guis, setGuis] = useState<Array<React.ReactElement>>();
	
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	useEffect(() => {
		return effect(() => {
			const guis = new Array<React.ReactElement>();
			
			const otherCharacterParts = OtherCharacters.partsAtoms();
			for (const [player, [characterPartsAtom, inputTypeAtom]] of otherCharacterParts) {
				if (player === client) {
					continue;
				}
				
				const characterParts = characterPartsAtom();
				if (characterParts === undefined) {
					continue;
				}
				
				const inputType = inputTypeAtom();
				
				guis.push((
					<billboardgui
						key={player.Name}
						Adornee={characterParts.body}
						Size={UDim2.fromOffset(px(600), px(200))}
						StudsOffset={new Vector3(0, 5, 0)}
					>
						<UIListLayout
							fillDirection={Enum.FillDirection.Vertical}
							alignX={Enum.HorizontalAlignment.Center}
							alignY={Enum.VerticalAlignment.Center}
						/>
						<Text
							styles={styles.world.nameplate.displayName}
							text={player.DisplayName}
							order={0}
							automaticHeight
						/>
						<Text
							styles={styles.world.nameplate.username}
							text={`@${player.Name}`}
							order={1}
							automaticHeight
						/>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromOffset(0, px(12))}
							LayoutOrder={2}
						/>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromOffset(0, StyleParse.px(px, styles.world.nameplate.icons.size, styles.world.nameplate.icons.autoScale))}
							AutomaticSize={Enum.AutomaticSize.X}
							LayoutOrder={3}
						>
							<UIListLayout
								fillDirection={Enum.FillDirection.Horizontal}
								padding={px(12)}
							/>
							<imagelabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								SizeConstraint={Enum.SizeConstraint.RelativeYY}
								Image={inputTypeImageMap.get(inputType) ?? Assets.Icons.QuestionIcon}
								LayoutOrder={0}
							/>
						</frame>
					</billboardgui>
				));
			}
			
			setGuis(guis);
		});
	}, [px, styles.world.nameplate.username, styles.world.nameplate.displayName, styles.world.nameplate.icons]);
	
	return (
		<folder
			key={'Characters'}
		>
			{guis}
		</folder>
	);
};

export default Characters;
