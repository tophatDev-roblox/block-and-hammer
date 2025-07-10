import { atom } from '@rbxts/charm';

import { waitForChild } from 'shared/waitForChild';
import { AreaManager } from 'shared/areaManager';

export namespace CharacterState {
	export interface Parts {
		model: Model;
		body: Part;
		centerAttachment: Attachment;
		targetAttachment: Attachment;
		rotationLock: AlignOrientation;
		distanceConstraint: RopeConstraint;
		hammer: {
			model: Model;
			head: Part;
			handle: Part;
			alignPosition: AlignPosition;
			alignOrientation: AlignOrientation;
		};
		bubbleChatOrigin: {
			connectionAttachment: Attachment;
		};
	}
	
	export async function createParts(character: Model): Promise<Parts> {
		const body = await waitForChild(character, 'Body', 'Part');
		const bubbleChatOrigin = await waitForChild(character, 'BubbleChatOrigin', 'Part');
		const hammer = await waitForChild(character, 'Hammer', 'Model');
		const head = await waitForChild(hammer, 'Head', 'Part');
		
		return {
			model: character,
			body: body,
			centerAttachment: await waitForChild(body, 'CenterAttachment', 'Attachment'),
			targetAttachment: await waitForChild(body, 'TargetAttachment1', 'Attachment'),
			rotationLock: await waitForChild(body, 'RotationLock', 'AlignOrientation'),
			distanceConstraint: await waitForChild(body, 'DistanceConstraint', 'RopeConstraint'),
			hammer: {
				model: hammer,
				handle: await waitForChild(hammer, 'Handle', 'Part'),
				head: head,
				alignPosition: await waitForChild(head, 'AlignPosition', 'AlignPosition'),
				alignOrientation: await waitForChild(head, 'AlignOrientation', 'AlignOrientation'),
			},
			bubbleChatOrigin: {
				connectionAttachment: await waitForChild(bubbleChatOrigin, 'ConnectionAttachment', 'Attachment'),
			},
		};
	}
	
	export const partsAtom = atom<CharacterState.Parts>();
	export const areaAtom = atom<AreaManager.Area>(AreaManager.Area.Unknown);
	export const timeStartAtom = atom<number>();
	export const hammerDistanceAtom = atom<number>(13);
	export const cameraZOffsetAtom = atom<number>(-36);
	export const mousePositionAtom = atom<Vector2>();
	export const thumbstickDirectionAtom = atom<Vector2>();
	export const disableCameraAtom = atom<boolean>(false);
	export const shakeStrengthAtom = atom<number>(0);
	export const ragdollTimeEndAtom = atom<number>();
	export const useLegacyPhysicsAtom = atom<boolean>(false);
}
