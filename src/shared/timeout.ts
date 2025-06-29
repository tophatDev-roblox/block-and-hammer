export function setTimeout<T extends Array<unknown>>(callback: (...args: T) => void, timeout: number, ...args: T): thread {
	return task.delay(timeout, callback, ...args);
}

export function clearTimeout(timeout: thread): void {
	task.cancel(timeout);
}
