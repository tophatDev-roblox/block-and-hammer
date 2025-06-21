export default class Units {
	static studsToMeters(this: void, studs: number): number {
		return studs * 0.28;
	}
	
	static metersToStuds(this: void, meters: number): number {
		return meters / 0.28;
	}
}
