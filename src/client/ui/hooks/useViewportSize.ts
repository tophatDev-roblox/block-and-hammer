import { atom } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';

import { camera } from 'client/character';

const viewportSizeAtom = atom<Vector2>(camera.ViewportSize);

let debounceThread: thread | undefined = undefined;

camera.GetPropertyChangedSignal('ViewportSize').Connect(() => {
	if (debounceThread !== undefined) {
		task.cancel(debounceThread);
	}
	
	debounceThread = task.delay(0.1, () => {
		debounceThread = undefined;
		viewportSizeAtom(camera.ViewportSize);
	});
});

export function useViewportSize(): Vector2 {
	const viewportSize = useAtom(viewportSizeAtom);
	return viewportSize;
}
