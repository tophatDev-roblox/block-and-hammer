import { GuiService, UserInputService } from '@rbxts/services';
import { atom, peek } from '@rbxts/charm';

import { Controller } from 'shared/controller';
import { Logger } from 'shared/logger';
import { UserSettings } from './userSettings';

const logger = new Logger('inputType');

export namespace InputType {
	export const enum Value {
		Unknown = 'Unknown',
		Desktop = 'Desktop',
		Touch = 'Touch',
		Controller = 'Controller',
	}
	
	export const stateAtom = atom<InputType.Value>(InputType.Value.Unknown);
}

if (GuiService.IsTenFootInterface()) {
	logger.print('detected 10-foot interface, switching to controller');
	InputType.stateAtom(InputType.Value.Controller);
} else if (UserInputService.GetConnectedGamepads().size() > 0) {
	logger.print('detected one or more connected gamepads, possibly using controller');
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
		logger.print('set to Controller');
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
		logger.print('set to', newInputType);
	}
}

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.InputChanged.Connect(processInput);
UserInputService.InputBegan.Connect(processInput);
UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
