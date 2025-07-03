import { Players } from '@rbxts/services';
import { atom } from '@rbxts/charm';

import { waitForChild } from 'shared/waitForChild';

const client = Players.LocalPlayer;

export namespace Leaderstats {
	export interface Parts {
		altitude: IntValue;
		area: StringValue;
	}
	
	export const stateAtom = atom<Parts>();
}

(async () => {
	const leaderstatsFolder = await waitForChild(client, 'leaderstats', 'Folder');
	const altitude = await waitForChild(leaderstatsFolder, 'Altitude', 'IntValue');
	const area = await waitForChild(leaderstatsFolder, 'Area', 'StringValue');
	
	Leaderstats.stateAtom({
		altitude,
		area,
	});
})();
