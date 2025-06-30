export namespace Dictionary {
	export function countKeys(dict: object): number {
		let keys = 0;
		for (const _ of pairs(dict)) {
			keys++;
		}
		
		return keys;
	}
}
