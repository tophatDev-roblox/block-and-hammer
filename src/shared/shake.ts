export default class Shake {
	static ui(this: void, shakeStrength: number, time: number, id: number, angle: number = 15): number {
		const noiseValue = time * 2;
		const multiplier = math.noise(
			math.sign(id & 0b100) * noiseValue,
			math.sign(id & 0b010) * noiseValue,
			math.sign(id & 0b001) * noiseValue,
		);
		
		return multiplier * shakeStrength * angle;
	}
	
	static camera(this: void, shakeStrength: number, time: number, maxAngle: number = 5): CFrame {
		const angle = math.rad(shakeStrength * maxAngle);
		const noiseValue = time * 2;
		
		return CFrame.fromOrientation(
			math.noise(noiseValue, 0) * angle,
			math.noise(0, noiseValue) * angle,
			math.noise(noiseValue, noiseValue) * angle,
		);
	}
}
