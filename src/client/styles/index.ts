import { atom } from '@rbxts/charm';

import defaultStyles from './default';

export namespace Styles {
	export interface Color {
		red: number;
		green: number;
		blue: number;
	}
	
	export interface ColorWithAlpha extends Color {
		alpha: number;
	}
	
	interface GradientColorKeypoint<T extends number = number> {
		position: T;
		color: Color;
	}
	
	interface GradientTransparencyKeypoint<T extends number = number> {
		position: T;
		transparency: number;
	}
	
	export interface Gradient {
		colors?: [GradientColorKeypoint<0>, ...Array<GradientColorKeypoint>, GradientColorKeypoint<1>];
		transparency?: [GradientTransparencyKeypoint<0>, ...Array<GradientTransparencyKeypoint>, GradientTransparencyKeypoint<1>];
		rotation: number;
	}
	
	export interface Font {
		fontId: string;
		weight: Enum.FontWeight['Value'];
		italics: boolean;
	}
	
	export interface Outline {
		color: ColorWithAlpha | Gradient;
		thickness: number;
		joinMode: 'miter' | 'round' | 'bevel';
		autoScale?: false;
	}
	
	export interface Text {
		font: Font;
		color: ColorWithAlpha | Gradient;
		size: number;
		outline: Outline | false;
		autoScale?: false;
	}
	
	export interface FloatDisplay {
		display: {
			decimals: number;
		};
	}
	
	export interface Button {
		text: Text;
		icon: {
			color: ColorWithAlpha | Gradient;
			background: ColorWithAlpha | Gradient;
		};
		background: ColorWithAlpha | Gradient;
		outline: Outline | false;
	}
	
	export interface Container {
		background: ColorWithAlpha | Gradient;
		outline: Outline | false;
	}
	
	export interface Data {
		version: 1;
		text: {
			containerTitle: Text;
			version: Text;
			timer: Text & { display: { millisecondsFontSize: number } };
			moveHint: Text;
			hudPrimary: Text & FloatDisplay;
			hudSecondary: Text & FloatDisplay;
			centurion: {
				bold: Font;
				medium: Font;
				regular: Font;
			};
		};
		world: {
			nameplate: {
				displayName: Text;
				username: Text;
			};
		};
		containers: {
			sideMenu: Container;
		};
		buttons: {
			sideMenu: Button;
		};
		layout: {}; // TODO: ui layout
	}
	
	export const stateAtom = atom<Styles.Data>(defaultStyles);
}

export namespace StyleParse {
	export const fallbackColor = Color3.fromRGB(255, 255, 255);
	
	export function areSequenceKeypointsValid(keypoints: Array<{ Time: number }>): boolean {
		return keypoints.size() >= 2 && keypoints[0].Time === 0 && keypoints[keypoints.size() - 1].Time === 1;
	}
	
	export function outlineJoinMode(joinMode: Styles.Outline['joinMode']): Enum.LineJoinMode {
		return joinMode === 'miter' ? Enum.LineJoinMode.Miter : joinMode === 'round' ? Enum.LineJoinMode.Round : Enum.LineJoinMode.Bevel;
	}
	
	export function color(color: Styles.Color | Styles.ColorWithAlpha): Color3 {
		return Color3.fromRGB(color.red, color.green, color.blue);
	}
	
	export function gradient(gradient: Styles.Gradient): LuaTuple<[ColorSequence | undefined, NumberSequence | undefined]> {
		let colorSequence: ColorSequence | undefined = undefined;
		if (gradient.colors !== undefined) {
			const colorKeypoints = new Array<ColorSequenceKeypoint>();
			for (const { position, color } of gradient.colors) {
				colorKeypoints.push(new ColorSequenceKeypoint(position, StyleParse.color(color)));
			}
			
			colorKeypoints.sort((a, b) => a.Time < b.Time);
			
			colorSequence = new ColorSequence(fallbackColor);
			if (StyleParse.areSequenceKeypointsValid(colorKeypoints)) {
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
			if (StyleParse.areSequenceKeypointsValid(numberKeypoints)) {
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
	
	export function fontWeight(weight: Styles.Font['weight']): Enum.FontWeight {
		for (const fontWeight of Enum.FontWeight.GetEnumItems()) {
			if (fontWeight.Value === weight) {
				return fontWeight;
			}
		}
		
		return Enum.FontWeight.Regular;
	}
	
	export function font(font: Styles.Font): Font {
		return new Font(font.fontId, StyleParse.fontWeight(font.weight), font.italics ? Enum.FontStyle.Italic : Enum.FontStyle.Normal);
	}
}
