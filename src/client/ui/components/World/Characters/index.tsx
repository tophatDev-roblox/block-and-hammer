import React, { useEffect, useState } from '@rbxts/react';

import { effect } from '@rbxts/charm';

import { OtherCharacters } from 'client/other-characters';

import Nameplate from './Nameplate';

const Characters: React.FC = () => {
	const [nameplates, setNameplates] = useState<Array<React.ReactElement>>();
	
	useEffect(() => {
		return effect(() => {
			const otherCharacterParts = OtherCharacters.partsAtoms();
			
			const nameplates = new Array<React.ReactElement>();
			
			for (const [player, { partsAtom, inputTypeAtom }] of otherCharacterParts) {
				nameplates.push((
					<Nameplate
						key={player.UserId}
						player={player}
						partsAtom={partsAtom}
						inputTypeAtom={inputTypeAtom}
					/>
				));
			}
			
			setNameplates(nameplates);
		});
	}, []);
	
	return (
		<folder>
			{nameplates}
		</folder>
	);
};

export default Characters;
