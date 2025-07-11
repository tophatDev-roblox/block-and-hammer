import { GuiService, UserInputService } from '@rbxts/services';

import { atom, peek, subscribe } from '@rbxts/charm';

import { Controller } from 'shared/controller';
import { InputType } from 'shared/inputType';
import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

import { UserSettings } from './userSettings';

const logger = new Logger('inputType');

export const clientInputTypeAtom = atom<InputType>(InputType.Unknown);

if (GuiService.IsTenFootInterface()) {
	logger.print('detected 10-foot interface, switching to controller');
	clientInputTypeAtom(InputType.Controller);
} else if (UserInputService.GetConnectedGamepads().size() > 0) {
	logger.print('detected one or more connected gamepads, possibly using controller');
	clientInputTypeAtom(InputType.Controller);
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
	const inputType = peek(clientInputTypeAtom);
	if (userSettings.controller.detectionType !== UserSettings.ControllerDetection.OnInput || inputType === InputType.Controller) {
		return;
	}
	
	if (Controller.isGamepadInput(input.UserInputType)) {
		if (input.KeyCode === Enum.KeyCode.Thumbstick1 || input.KeyCode === Enum.KeyCode.Thumbstick2) {
			if (input.Position.Magnitude < userSettings.controller.deadzonePercentage) {
				return;
			}
		}
		
		clientInputTypeAtom(InputType.Controller);
		logger.print('set to Controller');
	}
}

function onInputTypeChanged(userInputType: Enum.UserInputType): void {
	let newInputType: InputType | undefined = undefined;
	if (userInputType === Enum.UserInputType.Touch) {
		newInputType = InputType.Touch;
	} else if (Controller.isGamepadInput(userInputType)) {
		const userSettings = peek(UserSettings.stateAtom);
		if (userSettings.controller.detectionType === UserSettings.ControllerDetection.LastInput) {
			newInputType = InputType.Controller;
		}
	} else if (mouseInputTypes.has(userInputType)) {
		newInputType = InputType.Desktop;
	}
	
	if (newInputType !== undefined && newInputType !== peek(clientInputTypeAtom)) {
		clientInputTypeAtom(newInputType);
		logger.print('set to', newInputType);
	}
}

subscribe(clientInputTypeAtom, (inputType) => {
	Remotes.updateInputType(inputType);
});

onInputTypeChanged(UserInputService.GetLastInputType());

UserInputService.InputChanged.Connect(processInput);
UserInputService.InputBegan.Connect(processInput);
UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
