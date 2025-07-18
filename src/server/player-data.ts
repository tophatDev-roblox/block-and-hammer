import { Players, RunService } from '@rbxts/services';

import { Constants } from 'shared/constants';
import { Logger } from 'shared/logger';

import ProfileStore, { Profile } from 'shared/ProfileStore';

interface DataTemplate {
	color: Color3 | undefined;
	dollars: number;
}

type LoadedProfile = Profile<DataTemplate>;

const logger = new Logger('playerData');

let PlayerStore = ProfileStore.New<DataTemplate>('PlayerStore', {
	color: undefined,
	dollars: 100,
});

if (RunService.IsStudio() || game.PlaceId === Constants.TestingPlaceId) {
	logger.print('loaded mock datastore');
	PlayerStore = PlayerStore.Mock;
} else {
	logger.print('loaded live datastore');
}

const startSession = Promise.promisify((...args: Parameters<ProfileStore['StartSessionAsync']>) => PlayerStore.StartSessionAsync(...args));

const loadedProfiles = new Map<Player, LoadedProfile>();

export namespace PlayerData {
	export async function load(player: Player): Promise<LoadedProfile | undefined> {
		const profile = await startSession(`player_${player.UserId}`, {
			Cancel: () => player.Parent !== Players,
		});
		
		if (profile === undefined) {
			player.Kick('Profile failed to load, please rejoin');
			return undefined;
		}
		
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		
		profile.OnSessionEnd.Connect(() => {
			loadedProfiles.delete(player);
			player.Kick('Profile session ended, please rejoin');
		});
		
		if (player.Parent !== Players) {
			profile.EndSession();
			return undefined;
		}
		
		loadedProfiles.set(player, profile);
		return profile;
	}
	
	export function unload(player: Player): void {
		const profile = loadedProfiles.get(player);
		profile?.EndSession();
	}
}
