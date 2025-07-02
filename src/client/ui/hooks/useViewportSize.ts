import { atom, effect } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';
import { debounce } from '@rbxts/set-timeout';

import { Camera } from 'client/camera';

const defaultSize = new Vector2(1920, 1080);
const viewportSizeAtom = atom<Vector2>(defaultSize);

effect(() => {
	const camera = Camera.instanceAtom();
	if (camera === undefined) {
		viewportSizeAtom(defaultSize);
		return;
	}
	
	const onViewportSizeChanged = debounce((): void => {
		viewportSizeAtom(camera.ViewportSize);
	}, 0.1);
	
	const viewportSizeChangedEvent = camera.GetPropertyChangedSignal('ViewportSize').Connect(() => onViewportSizeChanged());
	
	return () => {
		viewportSizeChangedEvent.Disconnect();
	};
});

export function useViewportSize(): Vector2 {
	return useAtom(viewportSizeAtom);
}
