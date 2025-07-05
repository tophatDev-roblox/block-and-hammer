import { GuiService, Players, ReplicatedStorage, RunService, StarterGui, UserInputService, Workspace } from '@rbxts/services';
import { setTimeout } from '@rbxts/set-timeout';
import { effect, peek, subscribe } from '@rbxts/charm';
import { createMotion } from '@rbxts/ripple';

import { TimeSpan } from 'shared/timeSpan';
import { Raycast } from 'shared/raycast';
import { Controller } from 'shared/controller';
import { IsDebugPanelEnabled } from 'shared/constants';
import { AreaManager } from 'shared/areaManager';
import { Units } from 'shared/units';
import { waitForChild } from 'shared/waitForChild';
import { Logger } from 'shared/logger';
import { DebugPanel } from 'client/debugPanel';
import { UserSettings } from 'client/userSettings';
import { InputType } from 'client/inputType';
import { Camera } from 'client/camera';
import { Leaderstats } from 'client/leaderstats';
import { SideMenuState } from 'client/ui/sideMenuState';
import { ModalState } from 'client/ui/modalState';
import { CharacterState } from './state';

const client = Players.LocalPlayer;
const positionalInputTypes = new Set<Enum.UserInputType>([Enum.UserInputType.MouseMovement, Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);
const logger = new Logger('character');
const RNG = new Random();

let baseStunParticles: Part;
let rangeDisplay: Part;
let mouseCursorPart: Part;
let effectsFolder: Folder;
let mapFolder: Folder;

export namespace Character {
	export function quickReset(): void {
		const characterParts = peek(CharacterState.partsAtom);
		const area = CharacterState.areaAtom();
		if (characterParts === undefined || peek(CharacterState.forcePauseGameplayAtom)) {
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
		
		endRagdoll();
		effectsFolder.ClearAllChildren();
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
		const characterParts = peek(CharacterState.partsAtom);
		if (characterParts === undefined || peek(CharacterState.forcePauseGameplayAtom)) {
			return;
		}
		
		const ragdollTimeEnd = peek(CharacterState.ragdollTimeEndAtom);
		if (ragdollTimeEnd === undefined) {
			CharacterState.ragdollTimeEndAtom(TimeSpan.now() + seconds);
			
			const hammerDistance = peek(CharacterState.hammerDistanceAtom);
			characterParts.distanceConstraint.Length = hammerDistance;
			
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
			
			const rigidAttachment = stunParticles.FindFirstChild('Rigid.0') as Attachment;
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
			
			if (IsDebugPanelEnabled && peek(DebugPanel.disableRagdollAtom)) {
				return;
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
		} else {
			CharacterState.ragdollTimeEndAtom(ragdollTimeEnd + seconds * 0.75);
		}
	}
	
	export function shake(magnitude: number): void {
		if (peek(CharacterState.forcePauseGameplayAtom)) {
			return;
		}
		
		CharacterState.shakeStrengthAtom((shakeStrength) => math.max(magnitude, shakeStrength));
	}
}

function endRagdoll(): void {
	if (peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	CharacterState.ragdollTimeEndAtom(undefined);
	
	const characterParts = peek(CharacterState.partsAtom);
	if (characterParts !== undefined) {
		const hammerDistance = peek(CharacterState.hammerDistanceAtom);
		
		characterParts.model.FindFirstChild('StunParticles')?.Destroy();
		characterParts.rotationLock.Enabled = true;
		characterParts.targetAttachment.CFrame = CFrame.lookAlong(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
		characterParts.distanceConstraint.Length = hammerDistance * 1.1;
		
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
	if (input.KeyCode === Enum.KeyCode.M && input.UserInputState === Enum.UserInputState.Begin) {
		CharacterState.useLegacyPhysicsAtom((useLegacyPhysics) => !useLegacyPhysics);
		return;
	}
	
	if (peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	const camera = peek(Camera.instanceAtom);
	const characterParts = peek(CharacterState.partsAtom);
	const sideMenuOpen = peek(SideMenuState.isOpenAtom);
	const modal = peek(ModalState.stateAtom);
	if (camera === undefined || characterParts === undefined || sideMenuOpen || modal !== undefined) {
		return;
	}
	
	const inputType = peek(InputType.stateAtom);
	if (positionalInputTypes.has(input.UserInputType)) {
		CharacterState.mousePositionAtom(new Vector2(input.Position.X, input.Position.Y));
	} else if (Controller.isGamepadInput(input.UserInputType) && inputType === InputType.Value.Controller) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
			const userSettings = peek(UserSettings.stateAtom);
			
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

function onInputEnded(input: InputObject): void {
	const characterParts = peek(CharacterState.partsAtom);
	const inputType = peek(InputType.stateAtom);
	if (characterParts === undefined || inputType !== InputType.Value.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType) && input.KeyCode === Enum.KeyCode.Thumbstick2) {
		characterParts.targetAttachment.CFrame = CFrame.fromOrientation(math.pi / -2, 0, 0);
		CharacterState.thumbstickDirectionAtom(undefined);
	}
}

function onResetButton(): void {
	Character.quickReset();
}

async function onCharacterAdded(newCharacter: Model): Promise<void> {
	logger.print('character added');
	
	effectsFolder.ClearAllChildren();
	CharacterState.ragdollTimeEndAtom(undefined);
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
	
	const bubbleChatOrigin = newCharacter.FindFirstChild('BubbleChatOrigin') as Part;
	const bubbleChatAttachment = bubbleChatOrigin.FindFirstChild('Rigid.0') as Attachment;
	bubbleChatAttachment.Position = new Vector3(0, -1.5, 2.5);
	
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
	
	const currentTime = TimeSpan.now();
	
	let dontMoveTargetAttachment = false;
	
	const mousePosition = peek(CharacterState.mousePositionAtom);
	const inputType = peek(InputType.stateAtom);
	if (inputType === InputType.Value.Controller) {
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
	
	const disableCamera = peek(CharacterState.disableCameraAtom);
	if (!disableCamera) {
		const targetPosition = new Vector3(characterParts.body.Position.X, characterParts.body.Position.Y, peek(CharacterState.cameraZOffsetAtom));
		const cameraCFrame = CFrame.lookAlong(targetPosition, Vector3.zAxis, Vector3.yAxis);
		
		Camera.cframeMotion.spring(cameraCFrame, {
			tension: 500,
			friction: 60,
		});
		
		const ragdollTimeEnd = peek(CharacterState.ragdollTimeEndAtom);
		if (ragdollTimeEnd !== undefined && ragdollTimeEnd <= currentTime) {
			endRagdoll();
		}
	}
	
	const leaderstats = peek(Leaderstats.stateAtom);
	if (leaderstats !== undefined) {
		leaderstats.altitude.Value = math.round(math.max(Units.studsToMeters(characterParts.body.Position.Y - characterParts.body.Size.Y / 2), 0));
	}
}

function bindResetButtonCallback(resetEvent: BindableEvent): void {
	try {
		StarterGui.SetCore('ResetButtonCallback', resetEvent);
	} catch (err) {
		setTimeout(() => bindResetButtonCallback(resetEvent), 1);
	}
}

(async () => {
	const assetsFolder = await waitForChild(ReplicatedStorage, 'Assets', 'Folder');
	baseStunParticles = await waitForChild(assetsFolder, 'StunParticles', 'Part');
	rangeDisplay = await waitForChild(assetsFolder, 'RangeDisplay', 'Part');
	mouseCursorPart = await waitForChild(Workspace, 'MouseCursor', 'Part');
	effectsFolder = await waitForChild(Workspace, 'Effects', 'Folder');
	mapFolder = await waitForChild(Workspace, 'Map', 'Folder');
})();

const resetEvent = new Instance('BindableEvent');
resetEvent.Event.Connect(onResetButton);
bindResetButtonCallback(resetEvent);

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

subscribe(() => {
	CharacterState.partsAtom();
	return CharacterState.forcePauseGameplayAtom();
}, (forcePauseGameplay, previousForcePauseGameplay) => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined || forcePauseGameplay === previousForcePauseGameplay) {
		return;
	}
	
	logger.print('forcePauseGameplay =', forcePauseGameplay);
	
	if (forcePauseGameplay) {
		characterParts.body.Anchored = true;
		characterParts.hammer.head.Anchored = true;
		
		const startTime = peek(CharacterState.forcePauseTimeAtom);
		if (typeIs(startTime, 'number')) {
			CharacterState.forcePauseTimeAtom(TimeSpan.now() - startTime);
		}
	} else {
		characterParts.body.Anchored = false;
		characterParts.hammer.head.Anchored = false;
		
		const forcePauseTime = peek(CharacterState.forcePauseTimeAtom);
		if (forcePauseTime !== undefined) {
			CharacterState.forcePauseTimeAtom(TimeSpan.now() - forcePauseTime);
		}
	}
});

effect(() => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	const ragdollTimeEnd = CharacterState.ragdollTimeEndAtom();
	const hammerDistance = CharacterState.hammerDistanceAtom();
	if (ragdollTimeEnd === undefined) {
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
	
	const userSettings = UserSettings.stateAtom();
	
	const existingRangeDisplay = characterParts.model.FindFirstChild('RangeDisplay');
	if (userSettings.character.showRange) {
		if (existingRangeDisplay === undefined) {
			const clone = rangeDisplay.Clone();
			
			const alignPosition = clone.FindFirstChild('AlignPosition');
			if (!alignPosition?.IsA('AlignPosition')) {
				throw logger.format(`expected AlignPosition in RangeDisplay, got ${alignPosition?.ClassName}`);
			}
			
			alignPosition.Attachment1 = characterParts.centerAttachment;
			clone.Parent = characterParts.model;
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
