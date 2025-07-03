import { RunService } from '@rbxts/services';

export class Logger {
	public readonly prefixText: string;
	
	constructor(...scope: Array<string>) {
		const context = RunService.IsClient() ? 'client' : 'server';
		this.prefixText = `[${context}::${scope.join('/')}]`;
	}
	
	public print(...parameters: Array<unknown>): void {
		print(this.prefixText, ...parameters);
	}
	
	public warn(...parameters: Array<unknown>): void {
		warn(this.prefixText, ...parameters);
	}
	
	public format(...parameters: Array<string>): string {
		return `${this.prefixText} ${parameters.join(' ')}`;
	}
}
