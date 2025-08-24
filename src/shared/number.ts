export namespace Number {
	export const NaN = tonumber('nan')!;
	
	export function isNaN(x: number): boolean {
		return x !== x;
	}
	
	export function isInRange(x: number, minimum: number, maximum: number): boolean {
		return minimum <= x && x <= maximum;
	}
	
	export function clampStep(x: number, minimum: number, maximum: number, step: number): number {
		if (step <= 0) {
			return math.clamp(x, minimum, maximum);
		}
		
		const stepped = math.floor((x - minimum) / step) * step + minimum;
		
		return math.clamp(stepped, minimum, maximum);
	}
}
