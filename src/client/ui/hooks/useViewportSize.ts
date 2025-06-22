import { atom } from '@rbxts/charm';
import { useAtom } from '@rbxts/react-charm';

import { camera } from 'client/character';

const viewportSizeAtom = atom<Vector2>(camera.ViewportSize);

camera.GetPropertyChangedSignal('ViewportSize').Connect(() => {
	viewportSizeAtom(camera.ViewportSize);
});

export function useViewportSize(): Vector2 {
	const viewportSize = useAtom(viewportSizeAtom);
	return viewportSize;
}
