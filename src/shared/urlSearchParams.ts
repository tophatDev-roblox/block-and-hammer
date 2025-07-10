import { encodeURIComponent } from 'shared/encodeURIComponent';
import { String } from 'shared/string';

type ParamEntry = [string, string];

export default class URLSearchParams {
	private parameters: Array<ParamEntry> = [];
	
	constructor(init?: string | Record<string, string>) {
		if (typeIs(init, 'string')) {
			if (String.startsWith('?', init)) {
				init = init.sub(2);
			}
			
			for (const pair of init.split('&')) {
				if (!pair) {
					continue;
				}
				
				const [key, value = ''] = pair.split('=');
				this.append(key, value);
			}
		} else if (typeIs(init, 'table')) {
			for (const [key, value] of pairs(init)) {
				this.append(key, value);
			}
		}
	}
	
	public append(key: string, value: string): void {
		this.parameters.push([key, tostring(value)]);
	}
	
	public set(key: string, value: string): void {
		this.delete(key);
		this.append(key, value);
	}
	
	public get(key: string): string | undefined {
		for (const entry of this.parameters) {
			if (entry[0] === key) {
				return entry[1];
			}
		}
		
		return undefined;
	}
	
	public getAll(key: string): Array<string> {
		const values = new Array<string>();
		for (const entry of this.parameters) {
			if (entry[0] === key) {
				values.push(entry[1]);
			}
		}
		
		return values;
	}
	
	public delete(key: string): void {
		this.parameters = this.parameters.filter((entry) => entry[0] !== key);
	}
	
	public toString(): string {
		return this.parameters.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
	}
}
