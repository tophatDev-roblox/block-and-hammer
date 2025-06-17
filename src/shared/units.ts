export default class Units {
	static studsToMeters(studs: number): number {
		return studs * 0.28;
	}
	
	static metersToStuds(meters: number): number {
		return meters / 0.28;
	}
}
