import { GuiService } from '@rbxts/services';

export namespace Shake {
	export function getNoiseValue(time: number): number {
		const noiseValue = time * 2;
		if (GuiService.ReducedMotionEnabled) {
			return noiseValue * 0.4;
		}
		
		return noiseValue;
	}
	
	export function ui(shakeStrength: number, time: number, parameterId: number, angle: number = 15): number {
		const noiseValue = Shake.getNoiseValue(time);
		let multiplier = math.noise(
			math.sign(parameterId & 0b100) * noiseValue,
			math.sign(parameterId & 0b010) * noiseValue,
			math.sign(parameterId & 0b001) * noiseValue,
		);
		
		if (GuiService.ReducedMotionEnabled) {
			multiplier *= 0.3;
		}
		
		return multiplier * shakeStrength * angle;
	}
	
	export function camera(shakeStrength: number, time: number, altParameters: boolean, maxAngle: number = 5): CFrame {
		const noiseValue = Shake.getNoiseValue(time);
		
		let angle = math.rad(shakeStrength * maxAngle);
		if (GuiService.ReducedMotionEnabled) {
			angle *= 0.4;
		}
		
		return altParameters
			? CFrame.fromOrientation(math.noise(noiseValue, 0) * angle, math.noise(0, noiseValue) * angle, math.noise(noiseValue, noiseValue) * angle)
			: CFrame.fromOrientation(math.noise(noiseValue, noiseValue) * angle, math.noise(noiseValue, 0) * angle, math.noise(noiseValue, 0) * angle);
	}
}
