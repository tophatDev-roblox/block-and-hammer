import { atom, peek, subscribe } from '@rbxts/charm';

export namespace ModalState {
	export interface ModalState<T extends Array<string> = Array<string>> {
		title: string;
		body: string | React.ReactNode;
		dismissable: boolean;
		actions: T;
		callback: (action?: T[number]) => void;
	}
	
	export const stateAtom = atom<ModalState>();
	
	let queueLength = 0;
	
	export async function create<T extends Array<string>>(modal: Omit<ModalState<T>, 'callback'>): Promise<T[number] | undefined> {
		return new Promise<T[number] | undefined>((resolve) => {
			const currentModal = peek(stateAtom);
			if (currentModal === undefined) {
				stateAtom({ ...modal, callback: resolve });
			} else {
				queueLength++;
				
				let index = queueLength;
				const unsubscribe = subscribe(stateAtom, (newModal) => {
					if (newModal !== undefined) {
						return;
					}
					
					index--;
					if (index === 0) {
						queueLength--;
						stateAtom({ ...modal, callback: resolve });
						unsubscribe();
					}
				});
			}
		});
	}
	
	export function dismiss(): void {
		stateAtom(undefined);
	}
}
