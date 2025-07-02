import { Players } from '@rbxts/services';
import { atom } from '@rbxts/charm';

const client = Players.LocalPlayer;

export namespace Leaderstats {
	export interface Parts {
		altitude: IntValue;
		area: StringValue;
	}
	
	export const stateAtom = atom<Parts>();
}

async function load(): Promise<void> {
	return new Promise<void>((resolve) => {
		const leaderstatsFolder = client.WaitForChild('leaderstats');
		const altitude = leaderstatsFolder.WaitForChild('Altitude');
		const area = leaderstatsFolder.WaitForChild('Area');
		if (!altitude.IsA('IntValue') || !area.IsA('StringValue')) {
			throw '[client::leaderstats] Altitude is not an IntValue or Area is not a StringValue';
		}
		
		Leaderstats.stateAtom({
			altitude,
			area,
		});
		
		resolve();
	});
}

load();
