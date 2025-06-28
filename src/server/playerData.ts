import { Players, RunService } from '@rbxts/services';

import ProfileStore, { Profile } from 'shared/ProfileStore';
import { MaxDollars, MinDollars, TestingPlaceId } from 'shared/constants';
import { Number } from 'shared/number';

interface DataTemplate {
	dollars: number
}

type LoadedProfile = Profile<DataTemplate>;

let PlayerStore = ProfileStore.New<DataTemplate>('PlayerStore', {
	dollars: 100,
});

if (RunService.IsStudio() || game.PlaceId === TestingPlaceId) {
	print('[server::profileStore] loading mock datastore');
	PlayerStore = PlayerStore.Mock;
} else {
	print('[server::profileStore] loading live datastore');
}

const loadedProfiles = new Map<Player, LoadedProfile>();

export namespace PlayerData {
	export function load(player: Player): LoadedProfile | undefined {
		const profile = PlayerStore.StartSessionAsync(`player_${player.UserId}`, {
			Cancel: () => {
				return player.Parent !== Players;
			},
		});
		
		if (profile === undefined) {
			player.Kick('Profile failed to load, please rejoin');
			return undefined;
		}
		
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		
		profile.OnSessionEnd.Connect(() => {
			loadedProfiles.delete(player);
			player.Kick('Profile session ended - please rejoin');
		});
		
		if (player.Parent !== Players) {
			profile.EndSession();
			return undefined;
		}
		
		player.AttributeChanged.Connect((attribute) => {
			if (attribute === 'dollars') {
				const dollars = tonumber(player.GetAttribute('dollars'));
				if (dollars === undefined || Number.isNaN(dollars)) {
					return;
				}
				
				profile.Data.dollars = math.clamp(dollars, MinDollars, MaxDollars);
			}
		});
		
		loadedProfiles.set(player, profile);
		return profile;
	}
	
	export function unload(player: Player): void {
		const profile = loadedProfiles.get(player);
		profile?.EndSession();
	}
}
