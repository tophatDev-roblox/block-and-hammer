import { UserInputService } from '@rbxts/services';
import { atom, peek } from '@rbxts/charm';

import { Controller } from 'shared/controller';
import { UserSettings } from './settings';

export namespace InputType {
	export const enum Value {
		Unknown = 'Unknown',
		Desktop = 'Desktop',
		Touch = 'Touch',
		Controller = 'Controller',
	}
	
	export const stateAtom = atom<InputType.Value>(InputType.Value.Unknown);
}
if (UserInputService.GetConnectedGamepads().size() > 0) {
	print('[client::inputType] detected one or more connected gamepads, possibly using controller');
	InputType.stateAtom(InputType.Value.Controller);
}

const mouseInputTypes = new Set<Enum.UserInputType>([
	Enum.UserInputType.MouseMovement,
	Enum.UserInputType.MouseWheel,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
]);

function processInput(input: InputObject): void {
	const userSettings = peek(UserSettings.stateAtom);
	const inputType = peek(InputType.stateAtom);
	if (userSettings.controllerDetectionType !== UserSettings.ControllerDetection.OnInput || inputType === InputType.Value.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType)) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick1 || input.KeyCode === Enum.KeyCode.Thumbstick2) {
			if (input.Position.Magnitude < userSettings.controllerDeadzone) {
				return;
			}
		}
		
		InputType.stateAtom(InputType.Value.Controller);
		print('[client::inputType] set to Controller');
	}
}

function onInputTypeChanged(userInputType: Enum.UserInputType): void {
	let newInputType: InputType.Value | undefined = undefined;
	if (userInputType === Enum.UserInputType.Touch) {
		newInputType = InputType.Value.Touch;
	} else if (Controller.isGamepadInput(userInputType)) {
		const userSettings = peek(UserSettings.stateAtom);
		if (userSettings.controllerDetectionType === UserSettings.ControllerDetection.LastInput) {
			newInputType = InputType.Value.Controller;
		}
	} else if (mouseInputTypes.has(userInputType)) {
		newInputType = InputType.Value.Desktop;
	}
	
	if (newInputType !== undefined && newInputType !== peek(InputType.stateAtom)) {
		InputType.stateAtom(newInputType);
		print('[client::inputType] set to', newInputType);
	}
}

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.InputChanged.Connect(processInput);
UserInputService.InputBegan.Connect(processInput);
UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
