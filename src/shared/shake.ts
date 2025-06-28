export namespace Shake {
	export function ui(shakeStrength: number, time: number, parameterId: number, angle: number = 15): number {
		const noiseValue = time * 2;
		const multiplier = math.noise(
			math.sign(parameterId & 0b100) * noiseValue,
			math.sign(parameterId & 0b010) * noiseValue,
			math.sign(parameterId & 0b001) * noiseValue,
		);
		
		return multiplier * shakeStrength * angle;
	}
	
	export function camera(shakeStrength: number, time: number, altParameters: boolean, maxAngle: number = 5): CFrame {
		const angle = math.rad(shakeStrength * maxAngle);
		const noiseValue = time * 2;
		
		return altParameters
			? CFrame.fromOrientation(math.noise(noiseValue, 0) * angle, math.noise(0, noiseValue) * angle, math.noise(noiseValue, noiseValue) * angle)
			: CFrame.fromOrientation(math.noise(noiseValue, noiseValue) * angle, math.noise(noiseValue, 0) * angle, math.noise(noiseValue, 0) * angle);
	}
}
