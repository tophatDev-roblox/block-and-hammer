export namespace Units {
	export function studsToMeters(studs: number): number {
		return studs * 0.28;
	}
	
	export function metersToStuds(meters: number): number {
		return meters / 0.28;
	}
}
