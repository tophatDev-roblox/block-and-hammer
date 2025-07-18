export namespace PixelScale {
	export const baseSize = new Vector2(1920, 1080);
	
	// https://discord.com/channels/476080952636997633/476080952636997635/1146857136358432900
	export function calculate(viewportSize: Vector2): LuaTuple<[number, (px: number, rounded?: boolean) => number]> {
		let scale: number;
		if (viewportSize === baseSize) {
			scale = 1;
		} else {
			const width = math.log(viewportSize.X / baseSize.X, 2);
			const height = math.log(viewportSize.Y / baseSize.Y, 2);
			const centered = width + (height - width) * 0.5;
			scale = 2 ** centered;
		}
		
		return $tuple(scale, (px, rounded = true) => rounded ? math.round(px * scale) : px * scale);
	}
}
