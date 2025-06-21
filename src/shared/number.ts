export default class Number {
	static NaN = tonumber('nan')!;
	
	static isNaN(this: void, num: number): boolean {
		return num !== num;
	}
}
