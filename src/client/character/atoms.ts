import { atom } from '@rbxts/charm';

import { CharacterParts } from '.';

export const characterAtom = atom<CharacterParts>();
export const hammerDistanceAtom = atom<number>(13);
export const cameraZOffsetAtom = atom<number>(-30);
export const mousePositionAtom = atom<Vector2>();
export const disableCameraAtom = atom<boolean>(false);
export const shakeStrengthAtom = atom<number>(0);
export const useLegacyPhysicsAtom = atom<boolean>(false);
export const forcePauseGameplayAtom = atom<boolean>(false);
export const forcePauseTimeAtom = atom<number>();
