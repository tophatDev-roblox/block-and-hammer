import { atom } from '@rbxts/charm';

export enum ControllerDetectionType {
	None,
	OnInput,
	LastInput,
}

interface UserSettings {
	disableHaptics: boolean;
	controllerDetectionType: ControllerDetectionType;
	controllerDeadzone: number;
	controllerSmoothingEnabled: boolean;
	controllerSmoothingFactor: number;
}

export const userSettingsAtom = atom<UserSettings>({
	disableHaptics: false,
	controllerDetectionType: ControllerDetectionType.OnInput,
	controllerDeadzone: 0.1,
	controllerSmoothingEnabled: true,
	controllerSmoothingFactor: 15,
});
