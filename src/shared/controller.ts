export namespace Controller {
	export function isGamepadInput(userInputType: Enum.UserInputType): boolean {
		return userInputType.Value >= Enum.UserInputType.Gamepad1.Value && userInputType.Value <= Enum.UserInputType.Gamepad8.Value;
	}
}
