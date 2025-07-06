import { atom } from '@rbxts/charm';

import { AreaManager } from 'shared/areaManager';
import { waitForChild } from 'shared/waitForChild';

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
	}
	
	export async function createParts(character: Model): Promise<Parts> {
		const body = await waitForChild(character, 'Body', 'Part');
		const hammer = await waitForChild(character, 'Hammer', 'Model');
		const head = await waitForChild(hammer, 'Head', 'Part');
		
		return {
			model: character,
			body: body,
			centerAttachment: await waitForChild(body, 'Center.0', 'Attachment'),
			targetAttachment: await waitForChild(body, 'Target.1', 'Attachment'),
			rotationLock: await waitForChild(body, 'AlignOrientation', 'AlignOrientation'),
			distanceConstraint: await waitForChild(body, 'DistanceConstraint', 'RopeConstraint'),
			hammer: {
				model: hammer,
				handle: await waitForChild(hammer, 'Handle', 'Part'),
				head: head,
				alignPosition: await waitForChild(head, 'AlignPosition', 'AlignPosition'),
				alignOrientation: await waitForChild(head, 'AlignOrientation', 'AlignOrientation'),
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
