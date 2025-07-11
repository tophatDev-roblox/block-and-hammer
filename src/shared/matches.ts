export function matches<T>(value: unknown, targets: Array<T>): value is T {
	for (const target of targets) {
		if (value === target) {
			return true;
		}
	}
	
	return false;
}
