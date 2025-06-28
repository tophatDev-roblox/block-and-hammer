export namespace Number {
	export const NaN = tonumber('nan')!;
	
	export function isNaN(num: number): boolean {
		return num !== num;
	}
}
