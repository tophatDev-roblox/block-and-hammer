import { atom } from '@rbxts/charm';

export namespace UserSettings {
	interface Value {
		character: {
			showRange: boolean;
		};
		performance: {
			areaUpdateInterval: number;
		};
		controller: {
			detectionType: ControllerDetection;
			deadzonePercentage: number;
		};
		haptics: {
			disabled: boolean;
		};
	}
	
	export enum ControllerDetection {
		None,
		OnInput,
		LastInput,
	}
	
	export const stateAtom = atom<Value>({
		character: {
			showRange: true,
		},
		performance: {
			areaUpdateInterval: 0.2,
		},
		controller: {
			detectionType: ControllerDetection.OnInput,
			deadzonePercentage: 0.1,
		},
		haptics: {
			disabled: false,
		},
	});
}
