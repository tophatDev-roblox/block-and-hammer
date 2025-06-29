export type Timeout = thread;

export function setTimeout<T extends Array<unknown>>(callback: (...args: T) => void, timeout: number, ...args: T): thread {
	return task.delay(timeout, callback, ...args);
}

export function clearTimeout(timeout?: thread): void {
	if (timeout === undefined) {
		return;
	}
	
	task.cancel(timeout);
}
