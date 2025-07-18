import { GuiService } from '@rbxts/services';

import { atom, batch, effect, peek } from '@rbxts/charm';

import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

import { CharacterState } from 'client/character/state';
import { Preloader } from 'client/preloader';
import { CoreGuis } from 'client/core-guis';

const logger = new Logger('ui/start-screen-state');

export namespace StartScreenState {
	export const isVisibleAtom = atom<boolean>(true);
	export const loadingStatusAtom = atom<string>('initializing...');
	export const isLoadingFinishedAtom = atom<boolean>(false);
	export const loadingPercentageAtom = atom<number>(0);
}

Preloader.preloadAtom(StartScreenState.loadingStatusAtom, StartScreenState.loadingPercentageAtom, StartScreenState.isLoadingFinishedAtom);

effect(() => {
	const isVisible = StartScreenState.isVisibleAtom();
	
	CharacterState.disableCameraAtom(isVisible);
	
	batch(() => {
		CoreGuis.chatAtom(!isVisible);
		CoreGuis.playerListAtom(GuiService.IsTenFootInterface() ? false : !isVisible);
	});
	
	if (isVisible) {
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
