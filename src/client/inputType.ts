import { UserInputService } from '@rbxts/services';
import { atom, peek } from '@rbxts/charm';

import { Controller } from 'shared/controller';
import { ControllerDetectionType, userSettingsAtom } from './settings';

export const enum InputType {
	Unknown = 'Unknown',
	Desktop = 'Desktop',
	Touch = 'Touch',
	Controller = 'Controller',
}

export const inputTypeAtom = atom<InputType>(InputType.Unknown);

if (UserInputService.GetConnectedGamepads().size() > 0) {
	print('[client::inputType] detected one or more connected gamepads, possibly using controller');
	inputTypeAtom(InputType.Controller);
}

const mouseInputTypes = new Set<Enum.UserInputType>([
	Enum.UserInputType.MouseMovement,
	Enum.UserInputType.MouseWheel,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
]);

function processInput(input: InputObject): void {
	const userSettings = peek(userSettingsAtom);
	const inputType = peek(inputTypeAtom);
	if (userSettings.controllerDetectionType !== ControllerDetectionType.OnInput || inputType === InputType.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType)) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick1 || input.KeyCode === Enum.KeyCode.Thumbstick2) {
			if (input.Position.Magnitude < userSettings.controllerDeadzone) {
				return;
			}
		}
		
		inputTypeAtom(InputType.Controller);
		print('[client::inputType] set to Controller');
	}
}

function onInputTypeChanged(userInputType: Enum.UserInputType): void {
	let newInputType: InputType | undefined = undefined;
	if (userInputType === Enum.UserInputType.Touch) {
		newInputType = InputType.Touch;
	} else if (Controller.isGamepadInput(userInputType)) {
		const userSettings = peek(userSettingsAtom);
		if (userSettings.controllerDetectionType === ControllerDetectionType.LastInput) {
			newInputType = InputType.Controller;
		}
	} else if (mouseInputTypes.has(userInputType)) {
		newInputType = InputType.Desktop;
	}
	
	if (newInputType !== undefined && newInputType !== peek(inputTypeAtom)) {
		inputTypeAtom(newInputType);
		print('[client::inputType] set to', newInputType);
	}
}

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.InputChanged.Connect(processInput);
UserInputService.InputBegan.Connect(processInput);
UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
