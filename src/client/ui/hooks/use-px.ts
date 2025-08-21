import { useCallback, useMemo } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { PixelScale } from 'shared/pixel-scale';

import { Camera } from 'client/camera';

export type PxFunction = (px: number, rounded?: boolean) => number;

export function usePx(): PxFunction {
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	
	const [, callback] = useMemo(() => PixelScale.calculate(viewportSize), [viewportSize]);
	
	return useCallback(callback, [callback]);
}
