export namespace String {
	export function startsWith(startString: string, str: string): boolean {
		return str.sub(1, startString.size()) === startString;
	}
	
	export function endsWith(endString: string, str: string): boolean {
		return str.sub(-endString.size(), -1) === endString;
	}
	
	export function trimStart(str: string): string {
		return str.gsub('^%s+', '')[0];
	}
	
	export function trimEnd(str: string): string {
		return str.gsub('%s+$', '')[0];
	}
	
	export function trim(str: string): string {
		return String.trimEnd(String.trimStart(str));
	}
}
