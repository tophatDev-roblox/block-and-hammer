export interface ColorStyleData {
	red: number;
	green: number;
	blue: number;
}

export interface ColorStyleDataWithAlpha extends ColorStyleData {
	alpha: number;
}

interface GradientColorKeypoint<T extends number = number> {
	position: T;
	color: ColorStyleData;
}

interface GradientTransparencyKeypoint<T extends number = number> {
	position: T;
	transparency: number;
}

export interface GradientStyleData {
	colors?: [GradientColorKeypoint<0>, ...Array<GradientColorKeypoint>, GradientColorKeypoint<1>];
	transparency?: [GradientTransparencyKeypoint<0>, ...Array<GradientTransparencyKeypoint>, GradientTransparencyKeypoint<1>];
	rotation: number;
}

export interface FontStyleData {
	fontId: string;
	weight: Enum.FontWeight['Value'];
	italics: boolean;
}

export interface OutlineStyleData {
	color: ColorStyleDataWithAlpha | GradientStyleData;
	thickness: number;
	joinMode: 'miter' | 'round' | 'bevel';
	autoScale?: false;
}

export interface TextStyleData {
	font: FontStyleData;
	color: ColorStyleDataWithAlpha | GradientStyleData;
	size: number;
	outline: OutlineStyleData | false;
	autoScale?: false;
}

export interface FloatStyleData {
	decimals: number;
}

export interface ButtonStyleData {
	text: TextStyleData;
	icon: {
		color: ColorStyleDataWithAlpha | GradientStyleData;
		background: ColorStyleDataWithAlpha | GradientStyleData;
	};
	background: ColorStyleDataWithAlpha | GradientStyleData;
	outline: OutlineStyleData | false;
}

export interface ContainerStyleData {
	background: ColorStyleDataWithAlpha | GradientStyleData;
	outline: OutlineStyleData | false;
}

export interface StylesData {
	version: 1;
	text: {
		containerTitle: TextStyleData;
		version: TextStyleData;
		timer: TextStyleData & { display: { millisecondsFontSize: number } };
		moveHint: TextStyleData;
		hudPrimary: TextStyleData & { display: FloatStyleData };
		hudSecondary: TextStyleData & { display: FloatStyleData };
		centurion: {
			bold: FontStyleData;
			medium: FontStyleData;
			regular: FontStyleData;
		};
	};
	world: {
		nameplate: {
			displayName: TextStyleData;
			username: TextStyleData;
		};
	};
	containers: {
		sideMenu: ContainerStyleData;
	};
	buttons: {
		sideMenu: ButtonStyleData;
	};
	layout: {}; // TODO: ui layout
}

const fallbackColor = Color3.fromRGB(255, 255, 255);

export function areSequenceKeypointsValid(keypoints: Array<{ Time: number }>): boolean {
	return keypoints.size() >= 2 && keypoints[0].Time === 0 && keypoints[keypoints.size() - 1].Time === 1;
}

export function parseOutlineJoinMode(joinMode: OutlineStyleData['joinMode']): Enum.LineJoinMode {
	return joinMode === 'miter' ? Enum.LineJoinMode.Miter : joinMode === 'round' ? Enum.LineJoinMode.Round : Enum.LineJoinMode.Bevel;
}

export function parseColor(color: ColorStyleData | ColorStyleDataWithAlpha): Color3 {
	return Color3.fromRGB(color.red, color.green, color.blue);
}

export function parseGradientColor(gradient: GradientStyleData): LuaTuple<[ColorSequence | undefined, NumberSequence | undefined]> {
	let colorSequence: ColorSequence | undefined = undefined;
	if (gradient.colors !== undefined) {
		const colorKeypoints = new Array<ColorSequenceKeypoint>();
		for (const { position, color } of gradient.colors) {
			colorKeypoints.push(new ColorSequenceKeypoint(position, parseColor(color)));
		}
		
		colorKeypoints.sort((a, b) => a.Time < b.Time);
		
		colorSequence = new ColorSequence(fallbackColor);
		if (areSequenceKeypointsValid(colorKeypoints)) {
			try {
				colorSequence = new ColorSequence(colorKeypoints);
			} catch (err) {
				warn(`[client::stylesParser/gradient] failed to create color sequence: ${err}`);
			}
		} else {
			warn('[client::stylesParser/gradient] color must have at least 2 keypoints, start at 0 and end at 1');
		}
	}
	
	let numberSequence: NumberSequence | undefined;
	if (gradient.transparency !== undefined) {
		const numberKeypoints = new Array<NumberSequenceKeypoint>();
		for (const { position, transparency } of gradient.transparency) {
			numberKeypoints.push(new NumberSequenceKeypoint(position, transparency));
		}
		
		numberKeypoints.sort((a, b) => a.Time < b.Time);
		
		numberSequence = new NumberSequence(0);
		if (areSequenceKeypointsValid(numberKeypoints)) {
			try {
				numberSequence = new NumberSequence(numberKeypoints);
			} catch (err) {
				warn(`[client::stylesParser/gradient] failed to create transparency sequence: ${err}`);
			}
		} else {
			warn('[client::stylesParser/gradient] transparency must have at least 2 keypoints, start at 0 and end at 1');
		}
	}
	
	return $tuple(colorSequence, numberSequence);
}

export function parseFontWeight(weight: FontStyleData['weight']): Enum.FontWeight {
	for (const fontWeight of Enum.FontWeight.GetEnumItems()) {
		if (fontWeight.Value === weight) {
			return fontWeight;
		}
	}
	
	return Enum.FontWeight.Regular;
}

export function parseFontStyle(font: FontStyleData): Font {
	return new Font(font.fontId, parseFontWeight(font.weight), font.italics ? Enum.FontStyle.Italic : Enum.FontStyle.Normal);
}
