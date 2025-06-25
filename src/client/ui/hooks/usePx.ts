import { useCallback, useMemo } from '@rbxts/react';

import { calculatePixelScale } from 'shared/calculatePixelScale';
import { useViewportSize } from './useViewportSize';

export function usePx(): (px: number, rounded?: boolean) => number {
	const viewportSize = useViewportSize();
	
	const scale = useMemo(() => {
		// https://discord.com/channels/476080952636997633/476080952636997635/1146857136358432900
		return calculatePixelScale(viewportSize)[0];
	}, [viewportSize]);
	
	return useCallback((px, rounded = true) => rounded ? math.round(px * scale) : px * scale, [scale]);
}
