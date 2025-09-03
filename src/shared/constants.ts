import { RunService } from '@rbxts/services';

export namespace Constants {
	export const GameVersion = '0.3.1';
	
	export const MaxDollars = 999_999_999;
	export const MinDollars = -999_999_999;
	export const DefaultGravity = 196.2;
	
	export const CommunityId = 36101282;
	export const MainUniverseId = 4682463099;
	export const MainPlaceId = 13458875976;
	export const TestingPlaceId = 76516082215314;
	
	export const IsDebugPanelEnabled = RunService.IsStudio() || game.PlaceId === TestingPlaceId;
}
