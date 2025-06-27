import { atom } from '@rbxts/charm';

export enum ControllerDetectionType {
	None = -1,
	OnInput = 0,
	LastInput = 1,
}

interface UserSettings {
	disableHaptics: boolean;
	controllerDetectionType: ControllerDetectionType;
	controllerDeadzone: number;
}

export const userSettingsAtom = atom<UserSettings>({
	disableHaptics: false,
	controllerDetectionType: ControllerDetectionType.OnInput,
	controllerDeadzone: 0.1,
});
