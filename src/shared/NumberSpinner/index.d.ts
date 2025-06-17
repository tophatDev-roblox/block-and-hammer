declare class NumberSpinner {
	static fromGuiObject(GuiObject: GuiObject): NumberSpinner;
	public Value: number;
	public Prefix: string;
	public Suffix: string;
	public Decimals: number;
	public Duration: number;
	public Commas: boolean;
}

export = NumberSpinner;
