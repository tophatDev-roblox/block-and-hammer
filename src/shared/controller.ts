export namespace Controller {
	export const enum Direction {
		None,
		Up,
		Down,
		Left,
		Right,
	}
	
	export const UINavigationThumbstick = Enum.KeyCode.Thumbstick1;
	export const UINavigationSelect = Enum.KeyCode.ButtonA;
	
	export function isGamepadInput(userInputType: Enum.UserInputType): boolean {
		return userInputType.Value >= Enum.UserInputType.Gamepad1.Value && userInputType.Value <= Enum.UserInputType.Gamepad8.Value;
	}
	
	export function getThumbstickDirection(position: Vector2 | Vector3): Direction {
		if (position.Y < -0.5) {
			return Direction.Down;
		} else if (position.Y > 0.5) {
			return Direction.Up;
		} else if (position.X < -0.5) {
			return Direction.Left;
		} else if (position.X > 0.5) {
			return Direction.Right;
		}
		
		return Direction.None;
	}
}
