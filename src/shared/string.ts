export default class String {
	static startsWith(this: void, startString: string, str: string): boolean {
		return str.sub(1, startString.size()) === startString;
	}
	
	static endsWith(this: void, endString: string, str: string): boolean {
		return str.sub(-endString.size(), -1) === endString;
	}
}
