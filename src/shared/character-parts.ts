import { findFirstChild, waitForChild } from 'shared/wait-for-child';
import { Accessories } from 'shared/accessories';

export namespace CharacterParts {
	export interface Value {
		model: Model;
		body: Part;
		face: Decal;
		windTrail: Trail;
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
		accesories: {
			models: {
				hat: Model | undefined;
			};
			constraints: {
				hat: RigidConstraint;
			};
		};
	}
	
	export async function create(character: Model): Promise<Value> {
		const body = await waitForChild(character, 'Body', 'Part');
		const bubbleChatOrigin = await waitForChild(character, 'BubbleChatOrigin', 'Part');
		const hammer = await waitForChild(character, 'Hammer', 'Model');
		
		const head = await waitForChild(hammer, 'Head', 'Part');
		
		return {
			model: character,
			body: body,
			face: await waitForChild(body, 'Face', 'Decal'),
			windTrail: await waitForChild(body, 'Trail', 'Trail'),
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
			accesories: {
				models: {
					hat: findFirstChild(character, Accessories.Name.Hat, 'Model'),
				},
				constraints: {
					hat: await waitForChild(body, 'HatConstraint', 'RigidConstraint'),
				},
			},
		};
	}
}
