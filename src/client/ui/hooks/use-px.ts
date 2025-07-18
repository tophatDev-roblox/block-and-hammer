import { useCallback } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { atom, effect } from '@rbxts/charm';

import { PixelScale } from 'shared/pixel-scale';

import { Camera } from 'client/camera';

const scaleAtom = atom<number>(1);

export function usePx(): (px: number, rounded?: boolean) => number {
	const scale = useAtom(scaleAtom);
	return useCallback((px, rounded = true) => rounded ? math.round(px * scale) : px * scale, [scale]);
}

function onViewportSizeChange(camera: Camera): void {
	const [scale] = PixelScale.calculate(camera.ViewportSize);
	scaleAtom(scale);
}

effect(() => {
	const camera = Camera.instanceAtom();
	if (camera === undefined) {
		return;
	}
	
	onViewportSizeChange(camera);
	
	const viewportSizeChangedEvent = camera.GetPropertyChangedSignal('ViewportSize').Connect(() => onViewportSizeChange(camera));
	
	return () => {
		viewportSizeChangedEvent.Disconnect();
	};
});
