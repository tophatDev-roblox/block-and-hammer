import { atom } from '@rbxts/charm';

export namespace UserSettings {
	interface Value {
		areaUpdateInterval: number;
		disableHaptics: boolean;
		controllerDetectionType: ControllerDetection;
		controllerDeadzone: number;
	}
	
	export enum ControllerDetection {
		None,
		OnInput,
		LastInput,
	}
	
	export const stateAtom = atom<Value>({
		areaUpdateInterval: 0.2,
		disableHaptics: false,
		controllerDetectionType: ControllerDetection.OnInput,
		controllerDeadzone: 0.1,
	});
}
