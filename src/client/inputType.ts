import { UserInputService } from '@rbxts/services';
import { atom } from '@rbxts/charm';
import { isControllerInput } from 'shared/controller';

export enum InputType {
	Unknown,
	Desktop,
	Touch,
	Controller,
}

export const inputTypeAtom = atom<InputType>(InputType.Unknown);

if (UserInputService.GetConnectedGamepads().size() > 0) {
	print('[client::inputType] detected connected one or more connected gamepads, possibly using controller');
	inputTypeAtom(InputType.Controller);
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
	} else if (isControllerInput(userInputType)) {
		newInputType = InputType.Controller;
	} else if (mouseInputTypes.has(userInputType)) {
		newInputType = InputType.Desktop;
	}
	
	if (newInputType !== undefined && newInputType !== inputTypeAtom()) {
		inputTypeAtom(newInputType);
		print('[client::inputType] set to', InputType[newInputType]);
	}
}

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
