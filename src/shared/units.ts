export namespace Units {
	export const conversionFactors = {
		meters: 0.28,
	} as const;
	
	export function studsToMeters(studs: number): number {
		return studs * conversionFactors.meters;
	}
	
	export function metersToStuds(meters: number): number {
		return meters / conversionFactors.meters;
	}
}
