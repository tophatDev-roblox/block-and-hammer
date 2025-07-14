import { Logger } from './logger';

const logger = new Logger('waitForChild');

export async function waitForChild<T extends keyof Objects>(instance: Instance, childName: string): Promise<Instance>;
export async function waitForChild<T extends keyof Objects>(instance: Instance, childName: string, className: T): Promise<Objects[T]>;
export async function waitForChild<T extends keyof Objects>(instance: Instance, childName: string, className?: T): Promise<Instance> {
	return new Promise<Instance>((resolve, reject) => {
		const result = instance.WaitForChild(childName);
		if (className !== undefined && !result.IsA(className)) {
			reject(logger.format(`(${result.GetFullName()}) expected ${className}, got ${result.ClassName}`));
		} else {
			resolve(result);
		}
	});
}
