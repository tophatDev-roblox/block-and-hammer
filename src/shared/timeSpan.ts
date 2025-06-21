export default class TimeSpan {
	static milliseconds(milliseconds: number): number {
		return milliseconds / 1000;
	}
	
	static seconds(seconds: number): number {
		return seconds;
	}
	
	static minutes(minutes: number): number {
		return minutes * 60;
	}
	
	static hours(hours: number): number {
		return hours * 60 * 60;
	}
	
	static toMilliseconds(seconds: number, floor: boolean = false): number {
		const value = seconds / 1000;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	static toMinutes(seconds: number, floor: boolean = false): number {
		const value = seconds / 60;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	static toHours(seconds: number, floor: boolean = false): number {
		const value = seconds / 3600;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	static timeUntil(timestamp: number): number {
		return timestamp - os.clock();
	}
	
	static timeSince(timestamp: number): number {
		return os.clock() - timestamp;
	}
}
