export interface ColorStyleDataWithAlpha {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}

export interface ColorStyleData {
	red: number;
	green: number;
	blue: number;
}

export interface GradientStyleData {
	colors?: Record<number, ColorStyleData>;
	transparency?: Record<number, number>;
	rotation: number;
}

export interface FontStyleData {
	fontId: string;
	weight: number;
	italics: boolean;
}

export interface OutlineStyleData {
	color: ColorStyleDataWithAlpha | GradientStyleData;
	thickness: number;
	joinMode: 'miter' | 'round' | 'bevel';
}

export interface TextStyleData {
	font: FontStyleData;
	color: ColorStyleDataWithAlpha | GradientStyleData;
	size: number;
	outline: OutlineStyleData | false;
}

export interface FloatStyleData {
	decimals: number;
}

export interface ButtonStyleData {
	text: TextStyleData;
	background: ColorStyleDataWithAlpha | GradientStyleData;
	outline: OutlineStyleData | false;
}

export interface StylesData {
	version: 1;
	text: {
		containerTitle: TextStyleData;
		version: TextStyleData;
		timer: TextStyleData;
		timerMillisecondsFontSize: number;
		moveHint: TextStyleData;
		hudPrimary: TextStyleData & FloatStyleData;
		hudSecondary: TextStyleData & FloatStyleData;
		centurion: {
			bold: FontStyleData;
			medium: FontStyleData;
			regular: FontStyleData;
		};
	};
	container: {
		background: ColorStyleDataWithAlpha | GradientStyleData;
		outline: OutlineStyleData | false;
	};
	button: {
		primary: ButtonStyleData;
		secondary: ButtonStyleData;
	};
	layout: {}; // TODO: ui layout
}
