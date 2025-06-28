import { Players, ReplicatedStorage, RunService, StarterGui, TweenService, UserInputService, Workspace } from '@rbxts/services';
import { effect, peek, subscribe } from '@rbxts/charm';

import { TimeSpan } from 'shared/timeSpan';
import { Raycast } from 'shared/raycast';
import { Shake } from 'shared/shake';
import { Controller } from 'shared/controller';
import { DebugPanel } from 'client/debugPanel';
import { IsDebugPanelEnabled } from 'shared/constants';
import { userSettingsAtom } from 'client/settings';
import { InputType } from 'client/inputType';
import { SideMenu } from 'client/sideMenu';
import { CharacterState } from './state';

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
	const characterParts = peek(CharacterState.partsAtom);
	if (characterParts === undefined || peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	print('[client::character] running quick reset');
	
	hasTimeStarted = false;
	endRagdoll();
	CharacterState.mousePositionAtom(undefined);
	CharacterState.shakeStrengthAtom(0);
	characterParts.model.SetAttribute('justReset', true);
	characterParts.model.SetAttribute('startTime', undefined);
	mouseCursorPart.Position = new Vector3(0, -500, 0);
	
	const target = new CFrame(0, 3, 0);
	characterParts.model.PivotTo(target);
	previousCameraCFrame = CFrame.lookAlong(
		target.Position.add(new Vector3(0, 0, peek(CharacterState.cameraZOffsetAtom) / 3)),
		Vector3.yAxis.mul(-1),
		Vector3.zAxis,
	);
	
	characterParts.targetAttachment.CFrame = CFrame.lookAt(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
	characterParts.hammer.model.PivotTo(target);
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
	
	if (ragdollTimeEnd === undefined) {
		ragdollTimeEnd = os.clock() + seconds;
		
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
		TweenService.Create(rigidAttachment, new TweenInfo(0.7, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, -1, false, 0), {
			CFrame: rigidAttachment.CFrame.mul(CFrame.fromOrientation(0, math.pi, 0)),
		}).Play();
		
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
		ragdollTimeEnd += seconds * 0.75;
	}
}

export function shake(magnitude: number): void {
	if (peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	CharacterState.shakeStrengthAtom((shakeStrength) => math.max(magnitude, shakeStrength));
}

function endRagdoll(): void {
	if (peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	ragdollTimeEnd = undefined;
	
	const characterParts = peek(CharacterState.partsAtom);
	if (characterParts !== undefined) {
		characterParts.model.FindFirstChild('StunParticles')?.Destroy();
		characterParts.rotationLock.Enabled = true;
		characterParts.targetAttachment.CFrame = CFrame.lookAlong(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
		
		const params = Raycast.params(Enum.RaycastFilterType.Include, [mapFolder, characterParts.body]);
		const origin = characterParts.hammer.head.Position;
		const direction = characterParts.body.Position.sub(origin);
		
		const result = Workspace.Raycast(origin, direction, params);
		
		if (result?.Instance !== characterParts.body) {
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
	const characterParts = peek(CharacterState.partsAtom);
	if (characterParts === undefined) {
		return;
	}
	
	if (!hasTimeStarted) {
		characterParts.model.SetAttribute('startTime', TimeSpan.now());
		hasTimeStarted = true;
	}
	
	characterParts.targetAttachment.WorldCFrame = CFrame.lookAt(
		clampPositionToCircle(position.mul(new Vector3(1, 1, 0)), characterParts.body.Position, hammerDistance),
		characterParts.body.Position,
		Vector3.zAxis,
	);
}

function processInput(input: InputObject): void {
	if (input.KeyCode === Enum.KeyCode.M && input.UserInputState === Enum.UserInputState.Begin) {
		CharacterState.useLegacyPhysicsAtom((useLegacyPhysics) => !useLegacyPhysics);
		return;
	}
	
	if (input.UserInputState === Enum.UserInputState.Begin && input.UserInputType !== Enum.UserInputType.Touch || peek(CharacterState.forcePauseGameplayAtom)) {
		return;
	}
	
	const characterParts = peek(CharacterState.partsAtom);
	const inputType = peek(InputType.stateAtom);
	const userSettings = peek(userSettingsAtom);
	const sideMenuOpen = peek(SideMenu.isOpenAtom);
	const hammerDistance = peek(CharacterState.hammerDistanceAtom);
	if (characterParts === undefined || sideMenuOpen) {
		return;
	}
	
	if (positionalInputTypes.has(input.UserInputType)) {
		CharacterState.mousePositionAtom(new Vector2(input.Position.X, input.Position.Y));
	} else if (Controller.isGamepadInput(input.UserInputType) && inputType === InputType.Value.Controller) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
			let direction = input.Position;
			if (direction.Magnitude > 1) {
				direction = direction.Unit;
			} else if (input.Position.Magnitude < userSettings.controllerDeadzone) {
				direction = new Vector3(0, 0.001, 0);
			}
			
			const position = characterParts.body.Position.add(direction.mul(hammerDistance).mul(new Vector3(-1, 1, 0)));
			const [screenPosition] = camera.WorldToScreenPoint(position);
			CharacterState.mousePositionAtom(new Vector2(screenPosition.X, screenPosition.Y));
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
		CharacterState.mousePositionAtom(undefined);
	}
}

function onResetButton(): void {
	quickReset();
}

function onCharacterAdded(newCharacter: Model): void {
	print('[client::character] character added');
	
	hasTimeStarted = false;
	ragdollTimeEnd = undefined;
	CharacterState.mousePositionAtom(undefined);
	CharacterState.shakeStrengthAtom(0);
	newCharacter.SetAttribute('startTime', undefined);
	mouseCursorPart.Position = new Vector3(0, -500, 0);
	
	const body = newCharacter.FindFirstChild('Body') as Part;
	const hammer = newCharacter.FindFirstChild('Hammer') as Model;
	const head = hammer.FindFirstChild('Head') as Part;
	previousCameraCFrame = CFrame.lookAlong(body.Position.add(new Vector3(0, 0, peek(CharacterState.cameraZOffsetAtom) / 3)), Vector3.yAxis.mul(-1), Vector3.zAxis);
	
	CharacterState.partsAtom({
		model: newCharacter,
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
	});
	
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
	print('[client::character] character removing');
	CharacterState.partsAtom(undefined);
}

function onRenderStepped(dt: number): void {
	const currentTime = os.clock();
	const parts = peek(CharacterState.partsAtom);
	if (parts === undefined) {
		return;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
	
	const userSettings = peek(userSettingsAtom);
	const inputType = peek(InputType.stateAtom);
	const mousePosition = peek(CharacterState.mousePositionAtom);
	if (mousePosition !== undefined) {
		const ray = camera.ScreenPointToRay(mousePosition.X, mousePosition.Y);
		const position = rayIntersectXYPlane(ray);
		
		if (inputType === InputType.Value.Controller && userSettings.controllerSmoothingEnabled) {
			mouseCursorPart.Position = mouseCursorPart.Position.Lerp(position, dt * userSettings.controllerSmoothingFactor);
		} else {
			mouseCursorPart.Position = position;
		}
		
		moveTargetAttachment(mouseCursorPart.Position);
	} else if (inputType === InputType.Value.Controller) {
		mouseCursorPart.Position = parts.body.Position;
	}
	
	const disableCamera = peek(CharacterState.disableCameraAtom);
	if (!disableCamera) {
		const targetPosition = new Vector3(parts.body.Position.X, parts.body.Position.Y, peek(CharacterState.cameraZOffsetAtom));
		const cameraCFrame = CFrame.lookAlong(targetPosition, Vector3.zAxis, Vector3.yAxis);
		const finalCameraCFrame = previousCameraCFrame !== undefined ? previousCameraCFrame.Lerp(cameraCFrame, math.min(dt * 15, 1)) : cameraCFrame;
		
		camera.CFrame = finalCameraCFrame;
		previousCameraCFrame = finalCameraCFrame;
		
		const shakeStrength = peek(CharacterState.shakeStrengthAtom);
		if (shakeStrength > 0) {
			const shakeCFrame = Shake.camera(shakeStrength, currentTime, false);
			camera.CFrame = camera.CFrame.mul(shakeCFrame);
			
			CharacterState.shakeStrengthAtom(math.max(shakeStrength - dt * 1.5, 0));
		}
		
		if (ragdollTimeEnd !== undefined && ragdollTimeEnd <= currentTime) {
			endRagdoll();
		}
		
		const velocity = parts.body.AssemblyLinearVelocity.Magnitude;
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

subscribe(CharacterState.disableCameraAtom, (disableCamera) => {
	if (disableCamera) {
		camera.FieldOfView = 70;
	}
});

subscribe(() => {
	CharacterState.partsAtom();
	return CharacterState.forcePauseGameplayAtom();
}, (forcePauseGameplay, previousForcePauseGameplay) => {
	const characterParts = CharacterState.partsAtom();
	if (characterParts === undefined || forcePauseGameplay === previousForcePauseGameplay) {
		return;
	}
	
	print('[client::character] forcePauseGameplay =', forcePauseGameplay);
	
	if (forcePauseGameplay) {
		characterParts.body.Anchored = true;
		characterParts.hammer.head.Anchored = true;
		
		const startTime = characterParts.model.GetAttribute('startTime');
		if (typeIs(startTime, 'number')) {
			CharacterState.forcePauseTimeAtom(os.clock() - startTime);
		}
	} else {
		characterParts.body.Anchored = false;
		characterParts.hammer.head.Anchored = false;
		
		const forcePauseTime = peek(CharacterState.forcePauseTimeAtom);
		if (forcePauseTime !== undefined) {
			characterParts.model.SetAttribute('startTime', os.clock() - forcePauseTime);
		}
	}
});

effect(() => {
	const characterParts = CharacterState.partsAtom();
	const useLegacyPhysics = CharacterState.useLegacyPhysicsAtom();
	if (characterParts === undefined) {
		return;
	}
	
	print('[client::character] useLegacyPhysics =', useLegacyPhysics);
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
RunService.RenderStepped.Connect(onRenderStepped);
