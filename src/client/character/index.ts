import { Players, ReplicatedStorage, RunService, StarterGui, TweenService, UserInputService, Workspace } from '@rbxts/services';
import { peek, subscribe } from '@rbxts/charm';

import { TimeSpan } from 'shared/timeSpan';
import { Raycast } from 'shared/raycast';
import { Shake } from 'shared/shake';
import { Controller } from 'shared/controller';
import { debugDisableRagdollAtom } from 'client/debugPanel';
import { IsDebugPanelEnabled } from 'shared/constants';
import { userSettingsAtom } from 'client/settings';
import { InputType, inputTypeAtom } from 'client/inputType';
import { sideMenuOpenedAtom } from 'client/sideMenu';
import { cameraZOffsetAtom, characterAtom, disableCameraAtom, forcePauseGameplayAtom, forcePauseTimeAtom, hammerDistanceAtom, mousePositionAtom, shakeStrengthAtom } from './atoms';

export interface CharacterParts {
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

const client = Players.LocalPlayer;
const assetsFolder = ReplicatedStorage.WaitForChild('Assets') as Folder;
const baseStunParticles = assetsFolder.WaitForChild('StunParticles') as Part;
const mouseCursorPart = Workspace.WaitForChild('MouseCursor') as Part;
const mapFolder = Workspace.WaitForChild('Map') as Folder;
const positionalInputTypes = new Set<Enum.UserInputType>([Enum.UserInputType.MouseMovement, Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);
const RNG = new Random();
let ragdollTimeEnd: number | undefined = undefined;
let previousCameraCFrame: CFrame | undefined = undefined;
let hasTimeStarted = false;

export const camera = Workspace.WaitForChild('Camera') as Camera;

export function quickReset(): void {
	const character = peek(characterAtom);
	if (character === undefined || peek(forcePauseGameplayAtom)) {
		return;
	}
	
	print('[client::character] running quick reset');
	
	hasTimeStarted = false;
	endRagdoll();
	mousePositionAtom(undefined);
	shakeStrengthAtom(0);
	character.model.SetAttribute('justReset', true);
	character.model.SetAttribute('startTime', undefined);
	mouseCursorPart.Position = new Vector3(0, -500, 0);
	
	const target = new CFrame(0, 3, 0);
	character.model.PivotTo(target);
	previousCameraCFrame = CFrame.lookAlong(target.Position.add(new Vector3(0, 0, peek(cameraZOffsetAtom) / 3)), Vector3.yAxis.mul(-1), Vector3.zAxis);
	
	character.targetAttachment.CFrame = CFrame.lookAt(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
	character.hammer.model.PivotTo(target);
	character.body.AssemblyLinearVelocity = Vector3.zero;
	character.body.AssemblyAngularVelocity = Vector3.zero;
	character.hammer.head.AssemblyLinearVelocity = Vector3.zero;
	character.hammer.head.AssemblyAngularVelocity = Vector3.zero;
	character.hammer.handle.AssemblyLinearVelocity = Vector3.zero;
	character.hammer.handle.AssemblyAngularVelocity = Vector3.zero;
}

export function ragdoll(seconds: number): void {
	const character = peek(characterAtom);
	if (character === undefined || peek(forcePauseGameplayAtom)) {
		return;
	}
	
	if (ragdollTimeEnd === undefined) {
		ragdollTimeEnd = os.clock() + seconds;
		
		const centerAttachment = character.centerAttachment;
		
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
		TweenService.Create(rigidAttachment, new TweenInfo(0.7, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, -1, false, 0), {
			CFrame: rigidAttachment.CFrame.mul(CFrame.fromOrientation(0, math.pi, 0)),
		}).Play();
		
		stunParticles.Parent = character.model;
		
		if (IsDebugPanelEnabled && peek(debugDisableRagdollAtom)) {
			return;
		}
		
		const minAngle = 10;
		const maxAngle = 20;
		
		character.body.AssemblyAngularVelocity = new Vector3(
			RNG.NextNumber(minAngle, maxAngle),
			RNG.NextNumber(minAngle, maxAngle),
			RNG.NextNumber(minAngle, maxAngle),
		);
		
		character.rotationLock.Enabled = false;
		character.hammer.handle.CanCollide = true;
		character.hammer.alignPosition.Enabled = false;
		character.hammer.alignOrientation.Enabled = false;
	} else {
		ragdollTimeEnd += seconds * 0.75;
	}
}

export function shake(magnitude: number): void {
	if (peek(forcePauseGameplayAtom)) {
		return;
	}
	
	shakeStrengthAtom((shakeStrength) => math.max(magnitude, shakeStrength));
}

function endRagdoll(): void {
	if (peek(forcePauseGameplayAtom)) {
		return;
	}
	
	ragdollTimeEnd = undefined;
	
	const character = peek(characterAtom);
	if (character !== undefined) {
		character.model.FindFirstChild('StunParticles')?.Destroy();
		character.rotationLock.Enabled = true;
		character.targetAttachment.CFrame = CFrame.lookAlong(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
		
		const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder, character.body]);
		const origin = character.hammer.head.Position;
		const direction = character.body.Position.sub(origin);
		
		const result = Workspace.Raycast(origin, direction, params);
		
		if (result?.Instance !== character.body) {
			character.hammer.model.PivotTo(CFrame.lookAlong(character.body.Position, Vector3.yAxis.mul(-1), Vector3.zAxis));
		}
		
		character.hammer.handle.CanCollide = false;
		character.hammer.alignPosition.Enabled = true;
		character.hammer.alignOrientation.Enabled = true;
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
	const hammerDistance = peek(hammerDistanceAtom);
	const character = peek(characterAtom);
	if (character === undefined) {
		return;
	}
	
	if (!hasTimeStarted) {
		character.model.SetAttribute('startTime', TimeSpan.now());
		hasTimeStarted = true;
	}
	
	character.targetAttachment.WorldCFrame = CFrame.lookAt(
		clampPositionToCircle(position.mul(new Vector3(1, 1, 0)), character.body.Position, hammerDistance),
		character.body.Position,
		Vector3.zAxis,
	);
}

function processInput(input: InputObject): void {
	if (input.UserInputState === Enum.UserInputState.Begin && input.UserInputType !== Enum.UserInputType.Touch || peek(forcePauseGameplayAtom)) {
		return;
	}
	
	const inputType = peek(inputTypeAtom);
	const userSettings = peek(userSettingsAtom);
	const character = peek(characterAtom);
	const sideMenuOpened = peek(sideMenuOpenedAtom);
	const hammerDistance = peek(hammerDistanceAtom);
	if (character === undefined || sideMenuOpened) {
		return;
	}
	
	if (positionalInputTypes.has(input.UserInputType)) {
		mousePositionAtom(new Vector2(input.Position.X, input.Position.Y));
	} else if (Controller.isGamepadInput(input.UserInputType) && inputType === InputType.Controller) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
			let direction = input.Position;
			if (direction.Magnitude > 1) {
				direction = direction.Unit;
			} else if (input.Position.Magnitude < userSettings.controllerDeadzone) {
				direction = new Vector3(0, 0.001, 0);
			}
			
			const position = character.body.Position.add(direction.mul(hammerDistance).mul(new Vector3(-1, 1, 0)));
			mouseCursorPart.Position = position;
			moveTargetAttachment(position);
			mousePositionAtom(undefined);
		}
	}
}

function onInputEnded(input: InputObject): void {
	const character = peek(characterAtom);
	const inputType = peek(inputTypeAtom);
	if (character === undefined || inputType !== InputType.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType) && input.KeyCode === Enum.KeyCode.Thumbstick2) {
		character.targetAttachment.CFrame = CFrame.fromOrientation(math.pi / -2, 0, 0);
		mouseCursorPart.Position = new Vector3(0, -500, 0);
	}
}

function onResetButton(): void {
	quickReset();
}

function onCharacterAdded(newCharacter: Model): void {
	print('[client::character] character added');
	
	hasTimeStarted = false;
	ragdollTimeEnd = undefined;
	mousePositionAtom(undefined);
	shakeStrengthAtom(0);
	newCharacter.SetAttribute('startTime', undefined);
	mouseCursorPart.Position = new Vector3(0, -500, 0);
	
	const body = newCharacter.WaitForChild('Body') as Part;
	const hammer = newCharacter.WaitForChild('Hammer') as Model;
	const head = hammer.WaitForChild('Head') as Part;
	previousCameraCFrame = CFrame.lookAlong(body.Position.add(new Vector3(0, 0, peek(cameraZOffsetAtom) / 3)), Vector3.yAxis.mul(-1), Vector3.zAxis);
	
	characterAtom({
		model: newCharacter,
		body: body,
		centerAttachment: body.WaitForChild('Center.0') as Attachment,
		targetAttachment: body.WaitForChild('Target.1') as Attachment,
		rotationLock: body.WaitForChild('AlignOrientation') as AlignOrientation,
		hammer: {
			model: hammer,
			handle: hammer.WaitForChild('Handle') as Part,
			head: head,
			alignPosition: head.WaitForChild('AlignPosition') as AlignPosition,
			alignOrientation: head.WaitForChild('AlignOrientation') as AlignOrientation,
		},
	});
	
	const bubbleChatOrigin = newCharacter.WaitForChild('BubbleChatOrigin') as Part;
	const bubbleChatAttachment = bubbleChatOrigin.WaitForChild('Rigid.0') as Attachment;
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
	print('[client::character] character removing');
	
	characterAtom(undefined);
}

function onRenderStepped(dt: number): void {
	const currentTime = os.clock();
	const character = peek(characterAtom);
	if (character === undefined) {
		return;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
	
	const mousePosition = peek(mousePositionAtom);
	if (mousePosition !== undefined) {
		const ray = camera.ScreenPointToRay(mousePosition.X, mousePosition.Y);
		const position = rayIntersectXYPlane(ray);
		
		moveTargetAttachment(position);
		mouseCursorPart.Position = position;
	}
	
	const disableCamera = peek(disableCameraAtom);
	if (!disableCamera) {
		const targetPosition = new Vector3(character.body.Position.X, character.body.Position.Y, peek(cameraZOffsetAtom));
		const cameraCFrame = CFrame.lookAlong(targetPosition, Vector3.zAxis, Vector3.yAxis);
		const finalCameraCFrame = previousCameraCFrame !== undefined ? previousCameraCFrame.Lerp(cameraCFrame, math.min(dt * 15, 1)) : cameraCFrame;
		
		camera.CFrame = finalCameraCFrame;
		previousCameraCFrame = finalCameraCFrame;
		
		const shakeStrength = peek(shakeStrengthAtom);
		if (shakeStrength > 0) {
			const shakeCFrame = Shake.camera(shakeStrength, currentTime, false);
			camera.CFrame = camera.CFrame.mul(shakeCFrame);
			
			shakeStrengthAtom(math.max(shakeStrength - dt * 1.5, 0));
		}
		
		if (ragdollTimeEnd !== undefined && ragdollTimeEnd <= currentTime) {
			endRagdoll();
		}
		
		const velocity = character.body.AssemblyLinearVelocity.Magnitude;
		const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
		camera.FieldOfView = fieldOfView;
		
		if (velocity > 300) {
			const windCFrame = Shake.camera(math.min((velocity - 250) / 50, 6), currentTime, true, 2);
			camera.CFrame = camera.CFrame.mul(windCFrame);
		}
	}
}

task.spawn(() => {
	const resetEvent = new Instance('BindableEvent');
	resetEvent.Event.Connect(onResetButton);
	
	while (true) {
		try {
			StarterGui.SetCore('ResetButtonCallback', resetEvent);
			break;
		} catch (err) {
			task.wait(1);
		}
	}
});

subscribe(disableCameraAtom, (disableCamera) => {
	if (disableCamera) {
		camera.FieldOfView = 70;
	}
});

subscribe(() => {
	characterAtom();
	return forcePauseGameplayAtom();
}, (forcePauseGameplay, previousForcePauseGameplay) => {
	const character = characterAtom();
	if (character === undefined || forcePauseGameplay === previousForcePauseGameplay) {
		return;
	}
	
	print('[client::character] forcePauseGameplay =', forcePauseGameplay);
	
	if (forcePauseGameplay) {
		character.body.Anchored = true;
		character.hammer.head.Anchored = true;
		
		const startTime = character.model.GetAttribute('startTime');
		if (typeIs(startTime, 'number')) {
			forcePauseTimeAtom(os.clock() - startTime);
		}
	} else {
		character.body.Anchored = false;
		character.hammer.head.Anchored = false;
		
		const forcePauseTime = peek(forcePauseTimeAtom);
		if (forcePauseTime !== undefined) {
			character.model.SetAttribute('startTime', os.clock() - forcePauseTime);
		}
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
RunService.RenderStepped.Connect(onRenderStepped);
