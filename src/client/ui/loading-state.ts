import { atom, batch, peek, subscribe } from '@rbxts/charm';

import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

import { CharacterState } from 'client/character/state';
import { Preloader } from 'client/preloader';
import { CoreGuis } from 'client/core-guis';

import { UI } from 'client/ui/state';

const logger = new Logger('ui', 'start-screen-state');

export namespace LoadingState {
	export const statusAtom = atom<string>('initializing...');
	export const isFinishedAtom = atom<boolean>(false);
	export const percentageAtom = atom<number>(0);
}

Preloader.preloadAtom(LoadingState.statusAtom, LoadingState.percentageAtom, LoadingState.isFinishedAtom);

subscribe(UI.stateAtom, (state, previousState) => {
	const isInStartScreen = state === UI.State.StartScreen;
	const wasInStartScreen = previousState === UI.State.StartScreen;
	
	if (isInStartScreen === wasInStartScreen) {
		return;
	}
	
	batch(() => {
		CharacterState.disableCameraAtom(isInStartScreen);
		CoreGuis.playerListAtom(!isInStartScreen);
		
		if (isInStartScreen) {
			Remotes.character.unload.fire();
			
			const characterParts = peek(CharacterState.partsAtom);
			if (characterParts !== undefined) {
				characterParts.model.Destroy();
				
				CharacterState.partsAtom(undefined);
			}
		} else {
			Remotes.character.fullReset()
				.catch((err) => logger.warn('failed to fire `fullReset` -', err));
		}
	});
});
