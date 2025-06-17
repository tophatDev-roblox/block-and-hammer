import { Players, RunService, UserInputService, Workspace } from '@rbxts/services';

const camera = Workspace.WaitForChild('Camera') as Camera;
const client = Players.LocalPlayer;
let character: Model | undefined = undefined;
let body: Part | undefined = undefined;
let attachmentTarget: Attachment | undefined = undefined;

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
	character = newCharacter;
	body = newCharacter.WaitForChild('Body') as Part;
	attachmentTarget = body.WaitForChild('Target.1') as Attachment;
}

function onCharacterRemoving(): void {
	character = undefined;
}

function processInput(input: InputObject): void {
	if (input.UserInputState === Enum.UserInputState.Begin && input.UserInputType !== Enum.UserInputType.Touch) {
		return;
	}
	
	if (body === undefined || attachmentTarget === undefined) {
		return;
	}
	
	const maxHammerDistance = 13;
	let targetPosition: Vector3 | undefined = undefined;
	if (input.UserInputType === Enum.UserInputType.MouseMovement || input.UserInputType === Enum.UserInputType.Touch) {
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
			targetPosition = body.Position.add(input.Position.mul(maxHammerDistance).mul(new Vector3(-1, 1, 0)));
		}
	}
	
	if (targetPosition !== undefined) {
		attachmentTarget.WorldCFrame = CFrame.lookAt(targetPosition, body.Position, Vector3.zAxis);
	}
}

RunService.RenderStepped.Connect(onRenderStepped);

if (client.Character !== undefined) {
	onCharacterAdded(client.Character);
}

client.CharacterAdded.Connect(onCharacterAdded);
client.CharacterRemoving.Connect(onCharacterRemoving);

UserInputService.InputBegan.Connect(processInput);
UserInputService.InputChanged.Connect(processInput);
