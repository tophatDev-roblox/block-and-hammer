// https://discord.com/channels/476080952636997633/476080952636997635/1146857136358432900
export function calculatePixelScale(viewportSize: Vector2): LuaTuple<[number, (px: number, rounded?: boolean) => number]> {
	const width = math.log(viewportSize.X / 1920, 2);
	const height = math.log(viewportSize.Y / 1080, 2);
	const centered = width + (height - width) * 0.5;
	const scale = 2 ** centered;
	return $tuple(scale, (px, rounded = true) => rounded ? math.round(px * scale) : px * scale);
}
