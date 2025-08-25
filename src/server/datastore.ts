import { DataStoreService, RunService } from '@rbxts/services';

import { createCollection, Document, setConfig } from '@rbxts/lapis';
import { atom, Atom, subscribe } from '@rbxts/charm';
import { t } from '@rbxts/t';

import DataStoreServiceMock from '@rbxts/lapis-mockdatastore';

import { UserSettings } from 'shared/user-settings';
import { Accessories } from 'shared/accessories';
import { Constants } from 'shared/constants';
import { Logger } from 'shared/logger';

setConfig({
	dataStoreService: !RunService.IsStudio() && game.PlaceId === Constants.MainPlaceId ? DataStoreService : new DataStoreServiceMock(),
});

type CollectionSchema = t.static<typeof CollectionSchema>;
const CollectionSchema = t.strictInterface({
	color: t.optional(t.Color3),
	dollars: t.number,
	userSettings: UserSettings.Value,
	accessories: Accessories.PlayerAccessories,
});

const collection = createCollection<CollectionSchema>('player-data', {
	defaultData: {
		color: undefined,
		dollars: 100,
		userSettings: UserSettings.defaultValue,
		accessories: {
			hat: undefined,
		},
	},
	validate: CollectionSchema,
});

const logger = new Logger('datastore');
const loadedPlayers = new Map<Player, { unsubscribe: () => void, document: Document<CollectionSchema> }>();

export namespace PlayerData {
	export const documentAtoms = new Map<Player, Atom<CollectionSchema>>();
	
	export async function load(player: Player): Promise<Atom<CollectionSchema> | undefined> {
		try {
			const document = await collection.load(`player-${player.UserId}`, [player.UserId])
			
			if (player.Parent === undefined) {
				document.close()
					.catch((reason) => {
						logger.warn(`failed to close document for player ${player.UserId}: ${reason}`);
					});
				
				return undefined;
			}
			
			const data = document.read();
			const documentAtom = atom<Readonly<CollectionSchema>>(data);
			
			documentAtoms.set(player, documentAtom);
			
			const unsubscribe = subscribe(documentAtom, (state) => {
				player.SetAttribute('color', state.color);
				player.SetAttribute('dollars', state.dollars);
				
				document.write(state);
			});
			
			loadedPlayers.set(player, { unsubscribe, document });
			
			return documentAtom;
		} catch (err) {
			logger.warn(`failed to load document for player ${player.UserId}: ${err}`);
			
			player.Kick('Data failed to load, please rejoin');
			
			return undefined;
		}
	}
	
	export function unload(player: Player): void {
		const data = loadedPlayers.get(player);
		if (data !== undefined) {
			loadedPlayers.delete(player);
			
			data.unsubscribe();
			
			data.document.close()
				.catch((reason) => {
					logger.warn(`failed to close document for player ${player.UserId}: ${reason}`);
				});
		}
	}
}
