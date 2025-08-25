import { GuiService, Players, ReplicatedStorage, RunService, UserInputService, Workspace } from '@rbxts/services';

import Immut from '@rbxts/immut';

import { effect, peek, subscribe } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';
import { AreaManager } from 'shared/area-manager';
import { Controller } from 'shared/controller';
import { InputType } from 'shared/input-type';
import { TimeSpan } from 'shared/time-span';
import { Raycast } from 'shared/raycast';
import { Logger } from 'shared/logger';
import { Units } from 'shared/units';

import { clientInputTypeAtom } from 'client/input';
import { ClientSettings } from 'client/client-settings';
import { StatusEffect } from 'client/status-effect';
import { Leaderstats } from 'client/leaderstats';
import { Camera } from 'client/camera';

import { TransitionState } from 'client/ui/transition-state';
import { UI } from 'client/ui/state';

import { CharacterState } from './state';

const client = Players.LocalPlayer;
const positionalInputTypes = new Set<Enum.UserInputType>([Enum.UserInputType.MouseMovement, Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);
const logger = new Logger('character');

let rangeDisplay: Part;
let mouseCursorPart: Part;
let effectsFolder: Folder;
let mapFolder: Folder;

export namespace Character {
	export function quickReset(): void {
		const characterParts = peek(CharacterState.partsAtom);
		const area = CharacterState.areaAtom();
		if (characterParts === undefined) {
			return;
		}
		
		logger.print('running quick reset');
		
		let spawnCFrame = new CFrame(0, 3, 0);
		
		switch (area) {
			case AreaManager.Area.Unknown:
			case AreaManager.Area.Level1: {
				CharacterState.areaAtom(AreaManager.Area.Level1);
				break;
			}
		}
		
		effectsFolder.ClearAllChildren();
		CharacterState.statusEffectsAtom([]);
		CharacterState.timeStartAtom(undefined);
		CharacterState.mousePositionAtom(undefined);
		CharacterState.thumbstickDirectionAtom(undefined);
		CharacterState.shakeStrengthAtom(0);
		characterParts.model.SetAttribute('justReset', true);
		mouseCursorPart.Position = new Vector3(0, -500, 0);
		
		characterParts.model.PivotTo(spawnCFrame);
		
		Camera.cframeMotion.immediate(CFrame.lookAlong(
			spawnCFrame.Position.add(new Vector3(0, 0, peek(CharacterState.cameraZOffsetAtom) / 3)),
			!GuiService.ReducedMotionEnabled ? Vector3.yAxis.mul(-1) : Vector3.zAxis,
			Vector3.zAxis,
		));
		
		characterParts.targetAttachment.CFrame = CFrame.lookAt(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
		characterParts.hammer.model.PivotTo(spawnCFrame);
		characterParts.body.AssemblyLinearVelocity = Vector3.zero;
		characterParts.body.AssemblyAngularVelocity = Vector3.zero;
		characterParts.hammer.head.AssemblyLinearVelocity = Vector3.zero;
		characterParts.hammer.head.AssemblyAngularVelocity = Vector3.zero;
		characterParts.hammer.handle.AssemblyLinearVelocity = Vector3.zero;
		characterParts.hammer.handle.AssemblyAngularVelocity = Vector3.zero;
	}
	
	export function ragdoll(seconds: number): void {
		CharacterState.applyStatusEffects([
			[StatusEffect.Ragdoll, seconds],
			[StatusEffect.Dizzy, seconds],
		]);
	}
	
	export function shake(magnitude: number): void {
		CharacterState.shakeStrengthAtom((shakeStrength) => math.max(magnitude, shakeStrength));
	}
	
	export function endStatusEffects(i: number): void {
		const characterParts = peek(CharacterState.partsAtom);
		
		if (characterParts === undefined) {
			return;
		}
		
		CharacterState.statusEffectsAtom((statusEffects) => Immut.produce(statusEffects, (draft) => {
			const statusEffect = draft[i];
			
			Immut.table.remove(draft, i + 1);
			
			switch (statusEffect.type) {
				case StatusEffect.Ragdoll: {
					characterParts.rotationLock.Enabled = true;
					characterParts.targetAttachment.CFrame = CFrame.lookAlong(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
					
					const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder, characterParts.body]);
					const origin = characterParts.hammer.head.Position;
					const direction = characterParts.body.Position.sub(origin);
					
					const result = Workspace.Raycast(origin, direction, params);
					if (result !== undefined && result.Instance !== characterParts.body) {
						characterParts.hammer.model.PivotTo(CFrame.lookAlong(characterParts.body.Position, Vector3.yAxis.mul(-1), Vector3.zAxis));
					}
					
					characterParts.hammer.handle.CanCollide = false;
					characterParts.hammer.alignPosition.Enabled = true;
					characterParts.hammer.alignOrientation.Enabled = true;
					
					break;
				}
				case StatusEffect.Dizzy: {
					characterParts.model.FindFirstChild('StunParticles')?.Destroy();
					
					break;
				}
			}
		}));
	}
}

function rayIntersectXYPlane(ray: Ray): Vector3 {
	const distanceToPlane = (ray.Origin.Z / ray.Direction.Z) * -1;
	const position = ray.Origin.add(ray.Direction.mul(distanceToPlane));
	return position;
}

function clampPositionToCircle(position: Vector3, center: Vector3, radius: number): Vector3 {
	const direction = position.sub(center);
	const distance = direction.Magnitude;
	if (distance <= radius) {
		return position;
	}
	
	return center.add(direction.Unit.mul(radius));
}

function moveTargetAttachment(position: Vector3): void {
	const hammerDistance = peek(CharacterState.hammerDistanceAtom);
	const timeStarted = peek(CharacterState.timeStartAtom);
	const characterParts = peek(CharacterState.partsAtom);
	
	if (characterParts === undefined) {
		return;
	}
	
	const statusEffects = peek(CharacterState.statusEffectsAtom);
	
	if (CharacterState.hasStatusEffect(StatusEffect.Dizzy, statusEffects)) {
		position = new Vector3(
			2 * characterParts.body.Position.X - position.X,
			2 * characterParts.body.Position.Y - position.Y,
			0,
		);
	}
	
	const clampedPosition = clampPositionToCircle(position.mul(new Vector3(1, 1, 0)), characterParts.body.Position, hammerDistance);
	
	characterParts.targetAttachment.WorldCFrame = CFrame.lookAt(
		clampedPosition,
		characterParts.body.Position,
		Vector3.zAxis,
	);
	
	if (timeStarted === undefined && clampedPosition.sub(characterParts.body.Position).Magnitude > 0.5) {
		CharacterState.timeStartAtom(TimeSpan.now());
	}
}

function processInput(input: InputObject): void {
	const camera = peek(Camera.instanceAtom);
	const characterParts = peek(CharacterState.partsAtom);
	
	const state = peek(UI.stateAtom);
	const isTransitioning = peek(TransitionState.isTransitioningAtom);
	
	if (camera === undefined || characterParts === undefined || state !== UI.State.Game || isTransitioning) {
		return;
	}
	
	const inputType = peek(clientInputTypeAtom);
	if (positionalInputTypes.has(input.UserInputType)) {
		CharacterState.mousePositionAtom(new Vector2(input.Position.X, input.Position.Y));
	} else if (Controller.isGamepadInput(input.UserInputType) && inputType === InputType.Controller) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
			const userSettings = peek(ClientSettings.stateAtom);
			
			let direction = input.Position;
			if (direction.Magnitude > 1) {
				direction = direction.Unit;
			} else if (input.Position.Magnitude < userSettings.controller.deadzonePercentage) {
				CharacterState.thumbstickDirectionAtom(undefined);
				return;
			}
			
			CharacterState.thumbstickDirectionAtom(new Vector2(-direction.X, direction.Y));
		}
	}
}

function updateStatusEffects(): void {
	const currentTime = TimeSpan.now();
	
	const statusEffects = peek(CharacterState.statusEffectsAtom);
	for (const i of $range(0, statusEffects.size() - 1)) {
		const statusEffect = statusEffects[i];
		if (currentTime >= statusEffect.endTime) {
			Character.endStatusEffects(i);
			updateStatusEffects();
			break;
		}
	}
}

function onInputEnded(input: InputObject): void {
	const characterParts = peek(CharacterState.partsAtom);
	const inputType = peek(clientInputTypeAtom);
	if (characterParts === undefined || inputType !== InputType.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType) && input.KeyCode === Enum.KeyCode.Thumbstick2) {
		characterParts.targetAttachment.CFrame = CFrame.fromOrientation(math.pi / -2, 0, 0);
		CharacterState.thumbstickDirectionAtom(undefined);
	}
}

async function onCharacterAdded(newCharacter: Model): Promise<void> {
	logger.print('character added');
	
	effectsFolder.ClearAllChildren();
	CharacterState.statusEffectsAtom([]);
	CharacterState.timeStartAtom(undefined);
	CharacterState.mousePositionAtom(undefined);
	CharacterState.thumbstickDirectionAtom(undefined);
	CharacterState.shakeStrengthAtom(0);
	mouseCursorPart.Position = new Vector3(0, -500, 0);
	
	const characterParts = await CharacterState.createParts(newCharacter);
	CharacterState.partsAtom(characterParts);
	
	Camera.cframeMotion.immediate(CFrame.lookAlong(
		characterParts.body.Position.add(new Vector3(0, 0, peek(CharacterState.cameraZOffsetAtom) / 3)),
		!GuiService.ReducedMotionEnabled ? Vector3.yAxis.mul(-1) : Vector3.zAxis,
		Vector3.zAxis,
	));
	
	characterParts.bubbleChatOrigin.connectionAttachment.Position = new Vector3(0, -1.5, 2.5);
	
	// TODO: fix voicechat (idk how tho i havent found any guide for voicechat + new audio api)
	// const audioEmitter = newCharacter.WaitForChild('AudioEmitter') as AudioEmitter;
	// const wire = audioEmitter.WaitForChild('Wire') as Wire;
	// if (hasVoiceChat) {
	// 	wire.SourceInstance = client.WaitForChild('AudioDeviceInput');
	// } else {
	// 	audioEmitter.Destroy();
	// }
}

function onCharacterRemoving(): void {
	logger.print('character removing');
	
	CharacterState.partsAtom(undefined);
	CharacterState.mousePositionAtom(undefined);
	CharacterState.timeStartAtom(undefined);
	
	mouseCursorPart.Position = new Vector3(0, -500, 0);
}

function onPreRender(): void {
	const camera = peek(Camera.instanceAtom);
	const characterParts = peek(CharacterState.partsAtom);
	
	if (camera === undefined || characterParts === undefined) {
		return;
	}
	
	const state = peek(UI.stateAtom);
	
	if (state === UI.State.Game) {
		let dontMoveTargetAttachment = false;
		
		const mousePosition = peek(CharacterState.mousePositionAtom);
		const inputType = peek(clientInputTypeAtom);
		
		if (inputType === InputType.Controller) {
			const thumbstickDirection = peek(CharacterState.thumbstickDirectionAtom);
			if (thumbstickDirection !== undefined) {
				const hammerDistance = peek(CharacterState.hammerDistanceAtom);
				
				const relativeDirection = thumbstickDirection.mul(hammerDistance);
				const position = characterParts.body.Position.add(new Vector3(relativeDirection.X, relativeDirection.Y, 0));
				mouseCursorPart.Position = position;
			} else {
				mouseCursorPart.Position = characterParts.body.Position.add(new Vector3(0, 0.001, 0));
			}
		} else {
			if (mousePosition !== undefined) {
				const ray = camera.ScreenPointToRay(mousePosition.X, mousePosition.Y);
				const position = rayIntersectXYPlane(ray);
				mouseCursorPart.Position = position;
			} else {
				mouseCursorPart.Position = new Vector3(0, -500, 0);
				dontMoveTargetAttachment = true;
			}
		}
		
		if (!dontMoveTargetAttachment) {
			moveTargetAttachment(mouseCursorPart.Position);
		}
	}
	
	const disableCamera = peek(CharacterState.disableCameraAtom);
	
	if (!disableCamera) {
		const targetPosition = new Vector3(characterParts.body.Position.X, characterParts.body.Position.Y, peek(CharacterState.cameraZOffsetAtom));
		const cameraCFrame = CFrame.lookAlong(targetPosition, Vector3.zAxis, Vector3.yAxis);
		
		Camera.cframeMotion.spring(cameraCFrame, {
			tension: 500,
			friction: 60,
		});
	}
	
	const velocity = characterParts.body.AssemblyLinearVelocity.Magnitude;
	characterParts.windTrail.Enabled = velocity > 150;
	
	updateStatusEffects();
	
	const leaderstats = peek(Leaderstats.stateAtom);
	if (leaderstats !== undefined) {
		leaderstats.altitude.Value = math.round(math.max(Units.studsToMeters(characterParts.body.Position.Y - characterParts.body.Size.Y / 2), 0));
	}
}

(async () => {
	const assetsFolder = await waitForChild(ReplicatedStorage, 'Assets', 'Folder');
	rangeDisplay = await waitForChild(assetsFolder, 'RangeDisplay', 'Part');
	mouseCursorPart = await waitForChild(Workspace, 'MouseCursor', 'Part');
	effectsFolder = await waitForChild(Workspace, 'Effects', 'Folder');
	mapFolder = await waitForChild(Workspace, 'Map', 'Folder');
})();

subscribe(() => {
	CharacterState.partsAtom();
	return CharacterState.thumbstickDirectionAtom();
}, (thumbstickDirection, previousThumbstickDirection) => {
	if (thumbstickDirection === undefined || previousThumbstickDirection !== undefined) {
		return;
	}
	
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	const pivot = characterParts.hammer.model.GetPivot();
	if (pivot.Position.sub(characterParts.body.Position).Magnitude >= 1) {
		return;
	}
	
	const newPivot = CFrame.lookAlong(
		pivot.Position,
		new Vector3(thumbstickDirection.X, thumbstickDirection.Y, 0).Unit,
		Vector3.zAxis,
	).mul(CFrame.fromEulerAnglesXYZ(math.pi / -2, math.pi, 0));
	
	characterParts.hammer.model.PivotTo(newPivot);
});

effect(() => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	const statusEffects = CharacterState.statusEffectsAtom();
	const hammerDistance = CharacterState.hammerDistanceAtom();
	if (CharacterState.hasStatusEffect(StatusEffect.Ragdoll, statusEffects)) {
		characterParts.distanceConstraint.Length = hammerDistance * 1.1;
	} else {
		characterParts.distanceConstraint.Length = hammerDistance;
	}
});

effect(() => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	const userSettings = ClientSettings.stateAtom();
	
	const existingRangeDisplay = characterParts.model.FindFirstChild('RangeDisplay');
	if (userSettings.character.showRange) {
		const hammerDistance = CharacterState.hammerDistanceAtom();
		const size = new Vector3(0.001, hammerDistance * 2, hammerDistance * 2);
		
		if (existingRangeDisplay === undefined || !existingRangeDisplay.IsA('Part')) {
			const clone = rangeDisplay.Clone();
			clone.Size = size;
			clone.PivotTo(characterParts.body.CFrame);
			
			const alignPosition = clone.FindFirstChild('AlignPosition');
			if (!alignPosition?.IsA('AlignPosition')) {
				throw logger.format(`expected AlignPosition in RangeDisplay, got ${alignPosition?.ClassName}`);
			}
			
			alignPosition.Attachment1 = characterParts.centerAttachment;
			clone.Parent = characterParts.model;
		} else {
			existingRangeDisplay.Size = size;
		}
	} else {
		existingRangeDisplay?.Destroy();
	}
	
	const useLegacyPhysics = CharacterState.useLegacyPhysicsAtom();
	if (useLegacyPhysics) {
		characterParts.hammer.alignPosition.Responsiveness = 70;
		characterParts.hammer.alignPosition.MaxForce = 12_500;
		characterParts.hammer.alignOrientation.Responsiveness = 200;
		characterParts.hammer.alignOrientation.MaxTorque = math.huge;
		characterParts.hammer.handle.Massless = true;
		characterParts.hammer.handle.CustomPhysicalProperties = new PhysicalProperties(0.7, 0.3, 0, 1, 1);
		characterParts.hammer.head.Massless = true;
		characterParts.hammer.head.CustomPhysicalProperties = new PhysicalProperties(0.7, 0.6, 0, 100, 1);
		characterParts.body.Massless = true;
		characterParts.body.CustomPhysicalProperties = new PhysicalProperties(0.5, 0.3, 0, 1, 1);
	} else {
		characterParts.hammer.alignPosition.Responsiveness = 45;
		characterParts.hammer.alignPosition.MaxForce = 25_000;
		characterParts.hammer.alignOrientation.Responsiveness = 40;
		characterParts.hammer.alignOrientation.MaxTorque = 50_000;
		characterParts.hammer.handle.Massless = false;
		characterParts.hammer.handle.CustomPhysicalProperties = new PhysicalProperties(0.0001, 0.3, 0.5, 1, 1);
		characterParts.hammer.head.Massless = false;
		characterParts.hammer.head.CustomPhysicalProperties = new PhysicalProperties(1, 0.6, 0.1, 3, 4);
		characterParts.body.Massless = false;
		characterParts.body.CustomPhysicalProperties = new PhysicalProperties(0.9, 0.6, 0.2, 1.5, 2);
	}
});

if (client.Character !== undefined) {
	onCharacterAdded(client.Character);
}

UserInputService.InputBegan.Connect(processInput);
UserInputService.InputChanged.Connect(processInput);
UserInputService.InputEnded.Connect(onInputEnded);
client.CharacterAdded.Connect(onCharacterAdded);
client.CharacterRemoving.Connect(onCharacterRemoving);
RunService.PreRender.Connect(onPreRender);
