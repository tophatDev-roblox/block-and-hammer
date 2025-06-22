import { useMemo } from '@rbxts/react';

import { useViewportSize } from './useViewportSize';

// https://discord.com/channels/476080952636997633/476080952636997635/1146857136358432900
function calculateScale(viewportSize: Vector2): number {
	const width = math.log(viewportSize.X / 1920, 2);
	const height = math.log(viewportSize.Y / 1080, 2);
	const centered = width + (height - width) * 0.5;
	return 2 ** centered;
}

export function usePx(): (px: number, rounded?: boolean) => number {
	const viewportSize = useViewportSize();
	
	const scale = useMemo(() => calculateScale(viewportSize), [viewportSize]);
	
	return (px, rounded) => rounded === false ? px * scale : math.round(px * scale);
}
