export namespace Number {
	export const NaN = tonumber('nan')!;
	
	export function isNaN(x: number): boolean {
		return x !== x;
	}
	
	export function isInRange(x: number, minimum: number, maximum: number): boolean {
		return minimum < x && x < maximum;
	}
}
