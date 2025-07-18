export namespace TimeSpan {
	export function milliseconds(milliseconds: number): number {
		return milliseconds / 1000;
	}
	
	export function minutes(minutes: number): number {
		return minutes * 60;
	}
	
	export function hours(hours: number): number {
		return hours * 60 * 60;
	}
	
	export function toMilliseconds(seconds: number, floor: boolean = false): number {
		const value = seconds / 1000;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	export function toMinutes(seconds: number, floor: boolean = false): number {
		const value = seconds / 60;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	export function toHours(seconds: number, floor: boolean = false): number {
		const value = seconds / 3600;
		if (floor) {
			return math.floor(value);
		}
		
		return value;
	}
	
	export function timeUntil(timestamp: number): number {
		return timestamp - TimeSpan.now();
	}
	
	export function timeSince(timestamp: number): number {
		return TimeSpan.now() - timestamp;
	}
	
	export function now(): number {
		return os.clock();
	}
	
	export const sleep = Promise.promisify(task.wait);
}
