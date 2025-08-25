import { UserInputService } from '@rbxts/services';

import { atom, peek, subscribe } from '@rbxts/charm';

import { InputType } from 'shared/input-type';
import { Remotes } from 'shared/remotes';
import { Logger } from 'shared/logger';

const logger = new Logger('input');

export const clientInputTypeAtom = atom<InputType>(InputType.Unknown);

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

UserInputService.LastInputTypeChanged.Connect(onInputTypeChanged);
