import { useCallback, useMemo } from '@rbxts/react';

import { calculatePixelScale } from 'shared/calculatePixelScale';
import { useViewportSize } from './useViewportSize';

export function usePx(): (px: number, rounded?: boolean) => number {
	const viewportSize = useViewportSize();
	
	const scale = useMemo(() => calculatePixelScale(viewportSize)[0], [viewportSize]);
	
	return useCallback((px, rounded = true) => rounded ? math.round(px * scale) : px * scale, [scale]);
}
