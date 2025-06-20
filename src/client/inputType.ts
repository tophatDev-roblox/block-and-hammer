import { UserInputService } from '@rbxts/services';
import { atom } from '@rbxts/charm';

export enum InputType {
	Unknown,
	Desktop,
	Touch,
	Controller,
}

export const inputType = atom<InputType>(InputType.Unknown);

if (UserInputService.GetConnectedGamepads().size() > 0) {
	print('[client::inputType] detected connected one or more connected gamepads, possibly using controller');
	inputType(InputType.Controller);
}

const mouseInputTypes = new Set<Enum.UserInputType>([
	Enum.UserInputType.MouseMovement,
	Enum.UserInputType.MouseWheel,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
]);

function onInputTypeChanged(userInputType: Enum.UserInputType): void {
	let newInputType: InputType | undefined = undefined;
	if (userInputType === Enum.UserInputType.Touch) {
		newInputType = InputType.Touch;
	} else if (userInputType.Value >= Enum.UserInputType.Gamepad1.Value && userInputType.Value <= Enum.UserInputType.Gamepad8.Value) {
		newInputType = InputType.Controller;
	} else if (mouseInputTypes.has(userInputType)) {
		newInputType = InputType.Desktop;
	}
	
	if (newInputType !== undefined && newInputType !== inputType()) {
		inputType(newInputType);
		print('[client::inputType] set to', InputType[newInputType]);
	}
}

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
