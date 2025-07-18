import { ReplicatedStorage, RunService } from '@rbxts/services';

import { table as ImmutTable, produce } from '@rbxts/immut';
import { createMotion } from '@rbxts/ripple';
import { atom, peek } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';
import { AreaManager } from 'shared/area-manager';
import { Constants } from 'shared/constants';
import { TimeSpan } from 'shared/time-span';

import { DebugPanelState } from 'client/debug-panel/state';
import { StatusEffect } from 'client/status-effect';

const RNG = new Random();

let baseStunParticles: Part;

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
	
	export interface StatusEffectData {
		effect: StatusEffect;
		endTime: number;
		duration: number;
	}
	
	export function hasStatusEffect(effect: StatusEffect, statusEffects: ReadonlyArray<StatusEffectData>): boolean {
		for (const statusEffect of statusEffects) {
			if (statusEffect.effect === effect) {
				return true;
			}
		}
		
		return false;
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
	
	export function applyStatusEffects(effects: Array<[StatusEffect, number]>): void {
		const characterParts = peek(CharacterState.partsAtom);
		if (characterParts === undefined) {
			return;
		}
		
		CharacterState.statusEffectsAtom((statusEffects) => produce(statusEffects, (draft) => {
			for (const [effect, seconds] of effects) {
				let isAlreadyApplied = false;
				for (const i of $range(0, statusEffects.size() - 1)) {
					const statusEffect = draft[i];
					if (statusEffect.effect === effect) {
						statusEffect.endTime += seconds / 2;
						statusEffect.duration += seconds / 2;
						isAlreadyApplied = true;
						break;
					}
				}
				
				if (!isAlreadyApplied) {
					ImmutTable.insert(draft, { effect, endTime: TimeSpan.now() + seconds, duration: seconds });
					
					switch (effect) {
						case StatusEffect.Ragdoll: {
							if (Constants.IsDebugPanelEnabled && peek(DebugPanelState.disableRagdollAtom)) {
								break;
							}
							
							const minAngle = 10;
							const maxAngle = 20;
							
							characterParts.body.AssemblyAngularVelocity = new Vector3(
								RNG.NextNumber(minAngle, maxAngle),
								RNG.NextNumber(minAngle, maxAngle),
								RNG.NextNumber(minAngle, maxAngle),
							);
							
							characterParts.rotationLock.Enabled = false;
							characterParts.hammer.handle.CanCollide = true;
							characterParts.hammer.alignPosition.Enabled = false;
							characterParts.hammer.alignOrientation.Enabled = false;
							
							break;
						}
						case StatusEffect.Dizzy: {
							const centerAttachment = characterParts.centerAttachment;
							
							const stunParticles = baseStunParticles.Clone();
							for (const particleEmitter of stunParticles.GetDescendants()) {
								if (!particleEmitter.IsA('ParticleEmitter')) {
									continue;
								}
								
								particleEmitter.Emit(1);
							}
							
							const rigidConstraint = stunParticles.FindFirstChild('RigidConstraint') as RigidConstraint;
							rigidConstraint.Attachment1 = centerAttachment;
							
							const rigidAttachment = stunParticles.FindFirstChild('RigidAttachment0') as Attachment;
							const baseCFrame = rigidAttachment.CFrame;
							
							const attachmentMotion = createMotion<number>(0, {
								heartbeat: RunService.PreRender,
								start: true,
							});
							
							attachmentMotion.tween(math.pi, {
								style: Enum.EasingStyle.Linear,
								time: 0.7,
								repeatCount: -1,
							});
							
							attachmentMotion.onStep((rotation) => {
								rigidAttachment.CFrame = baseCFrame.mul(CFrame.fromOrientation(0, rotation, 0));
							});
							
							stunParticles.Destroying.Connect(() => {
								attachmentMotion.destroy();
							});
							
							stunParticles.Parent = characterParts.model;
							
							break;
						}
					}
				}
			}
		}));
	}
	
	export const partsAtom = atom<CharacterState.Parts>();
	export const statusEffectsAtom = atom<ReadonlyArray<StatusEffectData>>([]);
	export const areaAtom = atom<AreaManager.Area>(AreaManager.Area.Unknown);
	export const timeStartAtom = atom<number>();
	export const hammerDistanceAtom = atom<number>(13);
	export const cameraZOffsetAtom = atom<number>(-36);
	export const mousePositionAtom = atom<Vector2>();
	export const thumbstickDirectionAtom = atom<Vector2>();
	export const disableCameraAtom = atom<boolean>(false);
	export const shakeStrengthAtom = atom<number>(0);
	export const useLegacyPhysicsAtom = atom<boolean>(false);
}

(async () => {
	const assetsFolder = await waitForChild(ReplicatedStorage, 'Assets', 'Folder');
	baseStunParticles = await waitForChild(assetsFolder, 'StunParticles', 'Part');
})();
