export default class String {
	static startsWith(this: void, startString: string, str: string): boolean {
		return str.sub(1, startString.size()) === startString;
	}
	
	static endsWith(this: void, endString: string, str: string): boolean {
		return str.sub(-endString.size(), -1) === endString;
	}
	
	static trimStart(this: void, str: string): string {
		return str.gsub('^%s+', '')[0];
	}
	
	static trimEnd(this: void, str: string): string {
		return str.gsub('%s+$', '')[0];
	}
	
	static trim(this: void, str: string): string {
		return String.trimEnd(String.trimStart(str));
	}
}
