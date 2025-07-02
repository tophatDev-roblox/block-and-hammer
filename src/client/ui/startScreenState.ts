import { setTimeout } from '@rbxts/set-timeout';
import { atom, batch, effect } from '@rbxts/charm';

import { Remotes } from 'shared/remotes';
import { CharacterState } from 'client/character/state';
import { Preloader } from 'client/preloader';
import { CoreGuis } from 'client/coreGuis';

export namespace StartScreenState {
	export const isVisibleAtom = atom<boolean>(true);
	export const loadingStatusAtom = atom<string>('initializing...');
	export const isLoadingFinishedAtom = atom<boolean>(false);
	export const loadingPercentageAtom = atom<number>(0);
}

function fullReset(): void {
	const didReset = Remotes.fullReset();
	if (!didReset) {
		setTimeout(fullReset, 0.1);
	}
};

Preloader.preloadAtom(StartScreenState.loadingStatusAtom, StartScreenState.loadingPercentageAtom, StartScreenState.isLoadingFinishedAtom);

effect(() => {
	const isVisible = StartScreenState.isVisibleAtom();
	
	CharacterState.disableCameraAtom(isVisible);
	
	batch(() => {
		CoreGuis.chatAtom(!isVisible);
		CoreGuis.playerListAtom(!isVisible);
	});
	
	if (isVisible) {
		Remotes.unloadCharacter.fire();
	} else {
		fullReset();
	}
});
