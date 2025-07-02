import { atom } from '@rbxts/charm';

import { AreaManager } from 'shared/areaManager';

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
	
	export function createParts(character: Model): Parts {
		const body = character.FindFirstChild('Body') as Part;
		const hammer = character.FindFirstChild('Hammer') as Model;
		const head = hammer.FindFirstChild('Head') as Part;
		
		return {
			model: character,
			body: body,
			centerAttachment: body.FindFirstChild('Center.0') as Attachment,
			targetAttachment: body.FindFirstChild('Target.1') as Attachment,
			rotationLock: body.FindFirstChild('AlignOrientation') as AlignOrientation,
			hammer: {
				model: hammer,
				handle: hammer.FindFirstChild('Handle') as Part,
				head: head,
				alignPosition: head.FindFirstChild('AlignPosition') as AlignPosition,
				alignOrientation: head.FindFirstChild('AlignOrientation') as AlignOrientation,
			},
		};
	}
	
	export const partsAtom = atom<CharacterState.Parts>();
	export const areaAtom = atom<AreaManager.Area>(AreaManager.Area.Unknown);
	export const timeStartAtom = atom<number>();
	export const hammerDistanceAtom = atom<number>(13);
	export const cameraZOffsetAtom = atom<number>(-36);
	export const mousePositionAtom = atom<Vector2>();
	export const disableCameraAtom = atom<boolean>(false);
	export const shakeStrengthAtom = atom<number>(0);
	export const useLegacyPhysicsAtom = atom<boolean>(false);
	export const forcePauseGameplayAtom = atom<boolean>(false);
	export const forcePauseTimeAtom = atom<number>();
}
