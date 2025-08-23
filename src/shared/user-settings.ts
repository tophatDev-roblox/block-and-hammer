import { t } from '@rbxts/t';

export namespace UserSettings {
	export const defaultValue: Value = {
		general: {
			hideOthers: HideOthers.Never,
		},
		character: {
			showRange: true,
		},
		performance: {
			areaUpdateInterval: 0.2,
		},
		ui: {
			topbar: {
				displayPerformance: true,
				showPerformanceLabels: false,
			},
		},
		controller: {
			detectionType: ControllerDetection.OnInput,
			deadzonePercentage: 0.1,
		},
		haptics: {
			enabled: true,
		},
	};
	
	table.freeze(defaultValue);
	
	export const tControllerDetection = t.union(t.literal(0), t.literal(1), t.literal(2));
	export const enum ControllerDetection {
		Never,
		OnInput,
		LastInput,
	}
	
	export const tHideOthers = t.union(t.literal(0), t.literal(1), t.literal(2));
	export const enum HideOthers {
		Never,
		Always,
		NonFriends,
	}
	
	export type Value = t.static<typeof Value>;
	export const Value = t.strictInterface({
		general: t.strictInterface({
			hideOthers: tHideOthers,
		}),
		character: t.strictInterface({
			showRange: t.boolean,
		}),
		performance: t.strictInterface({
			areaUpdateInterval: t.number,
		}),
		ui: t.strictInterface({
			topbar: t.strictInterface({
				displayPerformance: t.boolean,
				showPerformanceLabels: t.boolean,
			}),
		}),
		controller: t.strictInterface({
			detectionType: tControllerDetection,
			deadzonePercentage: t.number,
		}),
		haptics: t.strictInterface({
			enabled: t.boolean,
		}),
	});
}
