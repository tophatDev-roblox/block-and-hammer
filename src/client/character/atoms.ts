import { atom } from '@rbxts/charm';

import { CharacterParts } from '.';

export const cameraZOffsetAtom = atom<number>(-30);
export const disableCameraAtom = atom<boolean>(false);
export const characterAtom = atom<CharacterParts>();
export const shakeStrengthAtom = atom<number>(0);
