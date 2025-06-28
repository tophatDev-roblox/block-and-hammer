import { atom } from '@rbxts/charm';

export namespace CharacterState {
	export interface Parts {
		model: Model;
		body: Part;
		centerAttachment: Attachment;
		targetAttachment: Attachment;
		rotationLock: AlignOrientation;
		hammer: {
			model: Model;
			head: Part;
			handle: Part;
			alignPosition: AlignPosition;
			alignOrientation: AlignOrientation;
		};
	}
	
	export const partsAtom = atom<CharacterState.Parts>();
	export const hammerDistanceAtom = atom<number>(13);
	export const cameraZOffsetAtom = atom<number>(-30);
	export const mousePositionAtom = atom<Vector2>();
	export const disableCameraAtom = atom<boolean>(false);
	export const shakeStrengthAtom = atom<number>(0);
	export const useLegacyPhysicsAtom = atom<boolean>(false);
	export const forcePauseGameplayAtom = atom<boolean>(false);
	export const forcePauseTimeAtom = atom<number>();
}
