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
				performanceDisplay: PerformanceDisplay.WithLabels,
			},
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
	
	export const tPerformanceDisplay = t.union(t.literal(0), t.literal(1), t.literal(2));
	export const enum PerformanceDisplay {
		Off,
		WithLabels,
		WithoutLabels,
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
			areaUpdateInterval: t.numberConstrained(0.1, 1),
		}),
		ui: t.strictInterface({
			topbar: t.strictInterface({
				performanceDisplay: tPerformanceDisplay,
			}),
		}),
		haptics: t.strictInterface({
			enabled: t.boolean,
		}),
	});
}
