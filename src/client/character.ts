import { Players, ReplicatedStorage, RunService, StarterGui, TweenService, UserInputService, Workspace } from '@rbxts/services';
import { atom } from '@rbxts/charm';

import TimeSpan from 'shared/timeSpan';
import { isControllerInput, isNotDeadzone } from 'shared/controller';

interface CharacterParts {
	model: Model;
	body: {
		part: Part;
		center: Attachment;
		target: Attachment;
		alignOrientation: AlignOrientation;
	};
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
const RNG = new Random();
let characterParts: CharacterParts | undefined = undefined;
let ragdollTimeEnd: number | undefined = undefined;
let hasTimeStarted = false;

export const camera = Workspace.WaitForChild('Camera') as Camera;
export const characterAtom = atom<Model>();

const positionalInputTypes = new Set<Enum.UserInputType>([Enum.UserInputType.MouseMovement, Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);

export function quickReset(): void {
	const character = characterAtom();
	if (character === undefined || characterParts === undefined) {
		return;
	}
	
	print('[client::character] running quick reset');
	
	hasTimeStarted = false;
	ragdollTimeEnd = undefined;
	character.SetAttribute('justReset', true);
	character.SetAttribute('startTime', undefined);
	
	const target = new CFrame(0, 3, 0);
	character.PivotTo(target);
	camera.CFrame = CFrame.lookAlong(target.Position.add(new Vector3(0, 0, -10)), Vector3.yAxis.mul(-1), Vector3.zAxis);
	
	characterParts.body.target.CFrame = CFrame.lookAt(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
	characterParts.hammer.model.PivotTo(target);
	characterParts.body.part.AssemblyLinearVelocity = Vector3.zero;
	characterParts.body.part.AssemblyAngularVelocity = Vector3.zero;
	characterParts.hammer.head.AssemblyLinearVelocity = Vector3.zero;
	characterParts.hammer.head.AssemblyAngularVelocity = Vector3.zero;
	characterParts.hammer.handle.AssemblyLinearVelocity = Vector3.zero;
	characterParts.hammer.handle.AssemblyAngularVelocity = Vector3.zero;
}

export function ragdoll(seconds: number): void {
	const character = characterAtom();
	if (character === undefined || characterParts === undefined) {
		return;
	}
	
	if (ragdollTimeEnd === undefined) {
		ragdollTimeEnd = os.clock() + seconds;
		
		const minAngle = 10;
		const maxAngle = 20;
		
		const body = characterParts.body.part;
		body.AssemblyAngularVelocity = new Vector3(
			RNG.NextNumber(minAngle, maxAngle),
			RNG.NextNumber(minAngle, maxAngle),
			RNG.NextNumber(minAngle, maxAngle),
		);
		
		const centerAttachment = characterParts.body.part.FindFirstChild('Center.0') as Attachment;
		
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
		
		stunParticles.Parent = character;
		
		characterParts.body.alignOrientation.Enabled = false;
		characterParts.hammer.handle.CanCollide = true;
		characterParts.hammer.alignPosition.Enabled = false;
		characterParts.hammer.alignOrientation.Enabled = false;
	} else {
		ragdollTimeEnd += seconds * 0.75;
	}
}

function processInput(input: InputObject): void {
	if (input.UserInputState === Enum.UserInputState.Begin && input.UserInputType !== Enum.UserInputType.Touch) {
		return;
	}
	
	const character = characterAtom();
	if (character === undefined || characterParts === undefined) {
		return;
	}
	
	const body = characterParts.body.part;
	const maxHammerDistance = 13;
	let targetPosition: Vector3 | undefined = undefined;
	if (positionalInputTypes.has(input.UserInputType)) {
		const ray = camera.ScreenPointToRay(input.Position.X, input.Position.Y);
		const distanceToPlane = (ray.Origin.Z / ray.Direction.Z) * -1;
		const position = ray.Origin.add(ray.Direction.mul(distanceToPlane));
		targetPosition = position;
		
		const directionToTarget = position.sub(body.Position);
		const distanceToTarget = directionToTarget.Magnitude;
		if (distanceToTarget > maxHammerDistance) {
			const scale = maxHammerDistance / distanceToTarget;
			const newPosition = new Vector3(body.Position.X + directionToTarget.X * scale, body.Position.Y + directionToTarget.Y * scale, 0);
			targetPosition = newPosition;
		}
	} else if (isControllerInput(input.UserInputType) && isNotDeadzone(input)) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick2) {
			let direction = input.Position;
			if (direction.Magnitude > 1) {
				direction = direction.Unit;
			}
			
			targetPosition = body.Position.add(direction.mul(maxHammerDistance).mul(new Vector3(-1, 1, 0)));
		}
	}
	
	if (targetPosition !== undefined) {
		if (!hasTimeStarted) {
			character.SetAttribute('startTime', TimeSpan.now());
			hasTimeStarted = true;
		}
		
		characterParts.body.target.WorldCFrame = CFrame.lookAt(targetPosition.mul(new Vector3(1, 1, 0)), body.Position, Vector3.zAxis);
	}
}

function onResetButton(): void {
	quickReset();
}

function onRenderStepped(dt: number): void {
	const currentTime = os.clock();
	if (characterParts === undefined) {
		return;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
	
	const targetPosition = new Vector3(characterParts.body.part.Position.X, characterParts.body.part.Position.Y, -30);
	const cameraCFrame = CFrame.lookAlong(targetPosition, Vector3.zAxis, Vector3.yAxis);
	if (camera.CFrame.Position.sub(cameraCFrame.Position).Magnitude > 30) {
		camera.CFrame = camera.CFrame.Lerp(cameraCFrame, 0.4);
	} else {
		camera.CFrame = camera.CFrame.Lerp(cameraCFrame, math.min(dt * 15, 1));
	}
	
	if (ragdollTimeEnd !== undefined && ragdollTimeEnd <= currentTime) {
		ragdollTimeEnd = undefined;
		
		if (characterParts !== undefined) {
			characterParts.model.FindFirstChild('StunParticles')?.Destroy();
			
			characterParts.body.alignOrientation.Enabled = true;
			characterParts.body.target.CFrame = CFrame.lookAlong(Vector3.zero, Vector3.yAxis.mul(-1), Vector3.zAxis);
			characterParts.hammer.model.PivotTo(CFrame.lookAlong(characterParts.body.part.Position, Vector3.yAxis.mul(-1), Vector3.zAxis));
			characterParts.hammer.handle.CanCollide = false;
			characterParts.hammer.alignPosition.Enabled = true;
			characterParts.hammer.alignOrientation.Enabled = true;
		}
	}
	
	const velocity = characterParts.body.part.AssemblyLinearVelocity.Magnitude;
	const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
	camera.FieldOfView = fieldOfView;
}

function onCharacterAdded(newCharacter: Model): void {
	print('[client::character] character added');
	
	hasTimeStarted = false;
	ragdollTimeEnd = undefined;
	newCharacter.SetAttribute('startTime', undefined);
	
	characterAtom(newCharacter);
	
	const body = newCharacter.WaitForChild('Body') as Part;
	const hammer = newCharacter.WaitForChild('Hammer') as Model;
	const head = hammer.WaitForChild('Head') as Part;
	camera.CFrame = CFrame.lookAlong(body.Position.add(new Vector3(0, 0, -10)), Vector3.yAxis.mul(-1), Vector3.zAxis);
	
	characterParts = {
		model: newCharacter,
		body: {
			part: body,
			center: body.WaitForChild('Center.0') as Attachment,
			target: body.WaitForChild('Target.1') as Attachment,
			alignOrientation: body.WaitForChild('AlignOrientation') as AlignOrientation,
		},
		hammer: {
			model: hammer,
			handle: hammer.WaitForChild('Handle') as Part,
			head: head,
			alignPosition: head.WaitForChild('AlignPosition') as AlignPosition,
			alignOrientation: head.WaitForChild('AlignOrientation') as AlignOrientation,
		},
	};
	
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
	characterParts = undefined;
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

if (client.Character !== undefined) {
	onCharacterAdded(client.Character);
}

RunService.RenderStepped.Connect(onRenderStepped);
client.CharacterAdded.Connect(onCharacterAdded);
client.CharacterRemoving.Connect(onCharacterRemoving);
UserInputService.InputBegan.Connect(processInput);
UserInputService.InputChanged.Connect(processInput);
