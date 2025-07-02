import { atom } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';

import { Camera } from 'client/camera';

const viewportSizeAtom = atom<Vector2>(Camera.instance.ViewportSize);

let debounceThread: thread | undefined = undefined;

Camera.instance.GetPropertyChangedSignal('ViewportSize').Connect(() => {
	if (debounceThread !== undefined) {
		task.cancel(debounceThread);
	}
	
	debounceThread = task.delay(0.1, () => {
		debounceThread = undefined;
		viewportSizeAtom(Camera.instance.ViewportSize);
	});
});

export function useViewportSize(): Vector2 {
	return useAtom(viewportSizeAtom);
}
