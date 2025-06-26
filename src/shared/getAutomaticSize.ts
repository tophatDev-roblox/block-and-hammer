export function getAutomaticSize(autoX: boolean, autoY: boolean): Enum.AutomaticSize {
	if (autoX && autoY) {
		return Enum.AutomaticSize.XY;
	} else if (autoX) {
		return Enum.AutomaticSize.X;
	} else if (autoY) {
		return Enum.AutomaticSize.Y;
	}
	
	return Enum.AutomaticSize.None;
}
