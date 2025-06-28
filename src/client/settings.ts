import { atom } from '@rbxts/charm';

export namespace UserSettings {
	interface Value {
		disableHaptics: boolean;
		controllerDetectionType: ControllerDetection;
		controllerDeadzone: number;
		controllerSmoothingEnabled: boolean;
		controllerSmoothingFactor: number;
	}
	
	export enum ControllerDetection {
		None,
		OnInput,
		LastInput,
	}
	
	export const stateAtom = atom<Value>({
		disableHaptics: false,
		controllerDetectionType: ControllerDetection.OnInput,
		controllerDeadzone: 0.1,
		controllerSmoothingEnabled: true,
		controllerSmoothingFactor: 15,
	});
}
