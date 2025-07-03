import { atom } from '@rbxts/charm';

import { Logger } from 'shared/logger';
import defaultStyles from './default';

const logger = new Logger('styles');

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
		rotation: number | {
			rotationsPerSecond: number;
		};
	}
	
	export type GradientWithoutTransparency = Omit<Gradient, 'transparency'>;
	
	export interface Font {
		fontId: string;
		weight: Enum.FontWeight['Value'];
		italics: boolean;
	}
	
	export type JoinMode =
		| 'miter'
		| 'round'
		| 'bevel';
	
	export interface Outline {
		color: ColorWithAlpha | Gradient;
		thickness: number;
		joinMode: JoinMode;
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
		background: ColorWithAlpha | Gradient;
		outline: Outline | false;
	}
	
	export interface ButtonWithIcon extends Button {
		icon: {
			color: ColorWithAlpha | Gradient;
			background: ColorWithAlpha | Gradient;
		};
	}
	
	export type TweenStyle =
		| 'linear'
		| 'sine'
		| 'back'
		| 'exponential';
	
	export type TweenDirection = 'in' | 'out';
	
	export interface ButtonWithInteraction extends Omit<Button, 'background'> {
		background: ColorWithAlpha;
		tween: {
			style: TweenStyle;
			direction: TweenDirection;
			time: number;
		};
		hover: {
			background?: ColorWithAlpha;
		};
		pressed: {
			background?: ColorWithAlpha;
		};
	}
	
	export interface Container {
		background: ColorWithAlpha | Gradient;
		outline: Outline | false;
	}
	
	export interface Data {
		version: 1;
		hud: {
			text: {
				altitude: Text & FloatDisplay;
				speedometer: Text & FloatDisplay;
				moveHint: Text;
			};
		};
		timer: {
			text: Text & {
				display: {
					milliseconds: {
						fontSize: number;
						autoScale?: false;
					};
				};
			};
		};
		subtitles: {
			text: Text;
			container: Container;
		};
		modal: {
			container: Container;
			text: {
				title: Text;
				body: {
					header: Text;
					paragraph: Text;
				};
			};
			actionButton: ButtonWithInteraction;
		};
		sideMenu: {
			container: Container;
			button: ButtonWithIcon;
		};
		startScreen: {
			logo: Text;
			button: ButtonWithIcon;
			loading: {
				background: Color | GradientWithoutTransparency;
				logo: Text;
				status: Text;
				percentage: Text;
			};
		};
		world: {
			nameplate: {
				displayName: Text;
				username: Text;
			};
		};
		centurion: {
			text: {
				bold: Font;
				medium: Font;
				regular: Font;
			};
		};
		controller: {
			selectionOutline: Outline;
		};
		misc: {
			text: {
				version: Text;
			};
		};
		layout: {}; // TODO: ui layout
	}
	
	export const stateAtom = atom<Styles.Data>(defaultStyles);
}

export namespace StyleParse {
	export const fallbackColor = Color3.fromRGB(255, 255, 255);
	
	export const TweenStyleMap: Record<Styles.TweenStyle, Enum.EasingStyle> = {
		linear: Enum.EasingStyle.Linear,
		sine: Enum.EasingStyle.Sine,
		back: Enum.EasingStyle.Back,
		exponential: Enum.EasingStyle.Exponential,
	};
	
	export function areSequenceKeypointsValid(keypoints: Array<{ Time: number }>): boolean {
		return keypoints.size() >= 2 && keypoints[0].Time === 0 && keypoints[keypoints.size() - 1].Time === 1;
	}
	
	export function isRGBA<T extends Styles.Color | Styles.ColorWithAlpha>(color: T | Styles.Gradient): color is T {
		return 'red' in color;
	}
	
	export function px(px: (px: number, rounded?: boolean) => number, value: number, autoScale?: boolean, rounded?: boolean): number {
		if (autoScale === false) {
			return value;
		}
		
		return px(value, rounded);
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
					logger.warn(`(gradient) failed to create color sequence: ${err}`);
				}
			} else {
				logger.warn('(gradient) color must have at least 2 keypoints, start at 0 and end at 1');
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
					logger.warn(`(gradient) failed to create transparency sequence: ${err}`);
				}
			} else {
				logger.warn('(gradient) transparency must have at least 2 keypoints, start at 0 and end at 1');
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
