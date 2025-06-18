export default class Number {
	static NaN = tonumber('nan')!;
	
	static isNaN(num: number): boolean {
		return num !== num;
	}
}
