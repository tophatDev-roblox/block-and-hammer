import { RunService } from '@rbxts/services';

type CallbackFunction = (dt: number, time: number) => void;

const callbacks = new Set<CallbackFunction>();

if (!RunService.IsStudio() || RunService.IsRunning()) {
	RunService.Stepped.Connect((time, dt) => {
		for (const callback of callbacks) {
			try {
				callback(dt, time);
			} catch (err) {
				warn('[client::hooks/useStepped] an error occured in the useStepped hook:', err);
			}
		}
	});
} else {
	RunService.Heartbeat.Connect((dt) => {
		for (const callback of callbacks) {
			try {
				callback(dt, os.clock());
			} catch (err) {
				warn('[client::hooks/useStepped] an error occured in the useStepped hook:', err);
			}
		}
	});
}

export function useStepped(callback: CallbackFunction): () => void {
	callbacks.add(callback);
	
	return () => {
		callbacks.delete(callback);
	}
}
