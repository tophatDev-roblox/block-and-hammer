import { Players, RunService, StarterGui, UserInputService, Workspace } from '@rbxts/services';
import { atom } from '@rbxts/charm';

const camera = Workspace.WaitForChild('Camera') as Camera;
const client = Players.LocalPlayer;
let body: Part | undefined = undefined;
let hammer: Model | undefined = undefined;
let attachmentTarget: Attachment | undefined = undefined;
let hasTimeStarted = false;

export const characterAtom = atom<Model>();

const positionalInputTypes = new Set<Enum.UserInputType>([Enum.UserInputType.MouseMovement, Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);

export function quickReset(): void {
	const character = characterAtom();
	if (character === undefined || hammer === undefined || body === undefined || attachmentTarget === undefined) {
		return;
	}
	
	print('[client::character] running quick reset');
	
	hasTimeStarted = false;
	character.SetAttribute('startTime', undefined);
	
	const target = new CFrame(0, 3, 0);
	character.PivotTo(target);
	hammer.PivotTo(target);
	
	attachmentTarget.CFrame = CFrame.fromOrientation(math.pi / -2, 0, 0);
	body.AssemblyLinearVelocity = Vector3.zero;
}

function processInput(input: InputObject): void {
	if (input.UserInputState === Enum.UserInputState.Begin && input.UserInputType !== Enum.UserInputType.Touch) {
		return;
	}
	
	const character = characterAtom();
	if (character === undefined || body === undefined || attachmentTarget === undefined) {
		return;
	}
	
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
	} else if (input.UserInputType.Value >= Enum.UserInputType.Gamepad1.Value && input.UserInputType.Value <= Enum.UserInputType.Gamepad8.Value) {
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
			character.SetAttribute('startTime', os.clock());
			hasTimeStarted = true;
		}
		
		attachmentTarget.WorldCFrame = CFrame.lookAt(targetPosition.mul(new Vector3(1, 1, 0)), body.Position, Vector3.zAxis);
	}
}

function onResetButton(): void {
	quickReset();
}

function onRenderStepped(dt: number): void {
	if (body === undefined) {
		return;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
	
	const cameraCFrame = CFrame.lookAlong(new Vector3(body.Position.X, body.Position.Y, -30), Vector3.zAxis, Vector3.yAxis);
	if (camera.CFrame.Position.sub(cameraCFrame.Position).Magnitude > 40) {
		camera.CFrame = camera.CFrame.Lerp(cameraCFrame, 0.4);
	} else {
		camera.CFrame = camera.CFrame.Lerp(cameraCFrame, math.min(dt * 15, 1));
	}
}

function onCharacterAdded(newCharacter: Model): void {
	print('[client::character] character added');
	
	hasTimeStarted = false;
	newCharacter.SetAttribute('startTime', undefined);
	
	characterAtom(newCharacter);
	body = newCharacter.WaitForChild('Body') as Part;
	hammer = newCharacter.WaitForChild('Hammer') as Model;
	attachmentTarget = body.WaitForChild('Target.1') as Attachment;
	
	// TODO: fix voicechat
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
	body = undefined;
	hammer = undefined;
	attachmentTarget = undefined;
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
