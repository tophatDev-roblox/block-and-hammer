import { GuiService } from '@rbxts/services';

import { atom, batch, peek, subscribe } from '@rbxts/charm';

import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

import { CharacterState } from 'client/character/state';
import { Preloader } from 'client/preloader';
import { CoreGuis } from 'client/core-guis';

import { LocationState } from './location-state';

const logger = new Logger('ui/start-screen-state');

export namespace LoadingState {
	export const statusAtom = atom<string>('initializing...');
	export const isFinishedAtom = atom<boolean>(false);
	export const percentageAtom = atom<number>(0);
}

Preloader.preloadAtom(LoadingState.statusAtom, LoadingState.percentageAtom, LoadingState.isFinishedAtom);

subscribe(LocationState.pathAtom, (path, previousPath) => {
	const isInStartScreen = LocationState.isAt('/start-screen', path);
	const wasInStartScreen = LocationState.isAt('/start-screen', previousPath);
	if (isInStartScreen === wasInStartScreen) {
		return;
	}
	
	CharacterState.disableCameraAtom(isInStartScreen);
	
	batch(() => {
		CoreGuis.chatAtom(!isInStartScreen);
		CoreGuis.playerListAtom(GuiService.IsTenFootInterface() ? false : !isInStartScreen);
	});
	
	if (isInStartScreen) {
		Remotes.unloadCharacter.fire();
		
		const characterParts = peek(CharacterState.partsAtom);
		if (characterParts !== undefined) {
			characterParts.model.Destroy();
			CharacterState.partsAtom(undefined);
		}
	} else {
		Remotes.fullReset()
			.catch((err) => logger.warn('failed to fire `fullReset` -', err));
	}
});
