import { atom } from '@rbxts/charm';

import { CharacterParts } from '.';

export const characterAtom = atom<CharacterParts>();
export const cameraZOffsetAtom = atom<number>(-30);
export const disableCameraAtom = atom<boolean>(false);
export const shakeStrengthAtom = atom<number>(0);
export const forcePauseGameplayAtom = atom<boolean>(false);
export const forcePauseTimeAtom = atom<number>();
