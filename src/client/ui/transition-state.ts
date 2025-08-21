import { atom, peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/time-span';

export namespace TransitionState {
	export const isTransitioningAtom = atom<boolean>(false);
	
	export async function beginTransitionAtom(): Promise<boolean> {
		if (peek(isTransitioningAtom)) {
			return TimeSpan.sleep(0).andThenReturn(false);
		}
		
		isTransitioningAtom(true);
		
		return TimeSpan.sleep(0.5).andThenReturn(true);
	}
}
