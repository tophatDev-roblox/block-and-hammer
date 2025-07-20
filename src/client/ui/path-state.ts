import { atom } from '@rbxts/charm';

export namespace PathState {
	export const enum Location {
		StartScreen,
		SideMenu,
	}
	
	export const valueAtom = atom<ReadonlyArray<Location>>([Location.StartScreen]);
	
	export function isAt(location: Location, path: ReadonlyArray<Location>): boolean {
		return path.size() > 0 && path[0] === location;
	}
}
