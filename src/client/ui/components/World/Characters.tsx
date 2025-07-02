import { Players } from '@rbxts/services';
import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { effect } from '@rbxts/charm';

import { OtherCharacters } from 'client/otherCharacters';
import { usePx } from 'client/ui/hooks/usePx';
import { Styles } from 'client/styles';
import UIListLayout from '../UIListLayout';
import Text from '../Text';

const client = Players.LocalPlayer;

const Characters: React.FC = () => {
	const [guis, setGuis] = useState<Array<React.ReactElement>>();
	
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	useEffect(() => {
		return effect(() => {
			const guis = new Array<React.ReactElement>();
			
			const otherCharacterParts = OtherCharacters.partsAtoms();
			for (const [player, characterPartsAtom] of otherCharacterParts) {
				const characterParts = characterPartsAtom();
				if (player === client || characterParts === undefined) {
					continue;
				}
				
				guis.push((
					<billboardgui
						Adornee={characterParts.body}
						Size={UDim2.fromOffset(px(600), px(150))}
						StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
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
					</billboardgui>
				));
			}
			
			setGuis(guis);
		});
	}, [px, styles.world.nameplate.username, styles.world.nameplate.displayName]);
	
	return (
		<folder>
			{guis}
		</folder>
	);
};

export default Characters;
