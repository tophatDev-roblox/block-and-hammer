import { atom } from '@rbxts/charm';
import { t } from '@rbxts/t';

import { Logger } from 'shared/logger';

import defaultStyles from './default';

const logger = new Logger('styles');

export namespace Styles {
	export const Default = defaultStyles;
	
	export type Color = t.static<typeof Color>;
	export const Color = t.interface({
		red: t.integer,
		green: t.integer,
		blue: t.integer,
	});
	
	export type ColorWithAlpha = t.static<typeof ColorWithAlpha>;
	export const ColorWithAlpha = t.intersection(Color, t.interface({
		alpha: t.integer,
	}));
	
	export type ColorKeypoint = t.static<typeof ColorKeypoint>;
	export const ColorKeypoint = t.interface({
		position: t.number,
		color: Color,
	});
	
	export type TransparencyKeypoint = t.static<typeof TransparencyKeypoint>;
	export const TransparencyKeypoint = t.interface({
		position: t.number,
		transparency: t.number,
	});
	
	export type Gradient = t.static<typeof Gradient>;
	export const Gradient = t.interface({
		colors: t.optional(t.array(ColorKeypoint)),
		transparency: t.optional(t.array(TransparencyKeypoint)),
		rotation: t.union(t.number, t.interface({
			rotationsPerSecond: t.number,
		})),
	});
	
	export type GradientWithoutTransparency = t.static<typeof GradientWithoutTransparency>;
	export const GradientWithoutTransparency = t.interface({
		transparency: t.optional(t.array(TransparencyKeypoint)),
		rotation: t.union(t.number, t.interface({
			rotationsPerSecond: t.number,
		})),
	});
	
	export type Font = t.static<typeof Font>;
	export const Font = t.interface({
		fontId: t.string,
		weight: t.literal(100, 200, 300, 400, 500, 600, 700, 800, 900),
		italics: t.boolean,
	});
	
	export type JoinMode = t.static<typeof JoinMode>;
	export const JoinMode = t.literal('miter', 'round', 'bevel');
	
	export type Outline = t.static<typeof Outline>;
	export const Outline = t.interface({
		color: t.union(ColorWithAlpha, Gradient),
		thickness: t.number,
		joinMode: JoinMode,
		autoScale: t.boolean,
	});
	
	export type Text = t.static<typeof Text>;
	export const Text = t.interface({
		font: Font,
		color: t.union(ColorWithAlpha, Gradient),
		size: t.number,
		outline: t.optional(Outline),
		autoScale: t.boolean,
	});
	
	export type FloatDisplay = t.static<typeof FloatDisplay>;
	export const FloatDisplay = t.interface({
		display: t.interface({
			decimals: t.number,
		}),
	});
	
	export type Button = t.static<typeof Button>;
	export const Button = t.interface({
		text: Text,
		background: t.union(ColorWithAlpha, Gradient),
		outline: t.optional(Outline),
	});
	
	export type ButtonWithIcon = t.static<typeof ButtonWithIcon>;
	export const ButtonWithIcon = t.intersection(Button, t.interface({
		icon: t.interface({
			color: t.union(ColorWithAlpha, Gradient),
			background: t.union(ColorWithAlpha, Gradient),
		}),
	}));
	
	export type TweenStyle = t.static<typeof TweenStyle>;
	export const TweenStyle = t.literal('linear', 'sine', 'back', 'exponential');
	
	export type TweenDirection = t.static<typeof TweenDirection>;
	export const TweenDirection = t.literal('in', 'out');
	
	export type ButtonWithInteraction = t.static<typeof ButtonWithInteraction>;
	export const ButtonWithInteraction = t.interface({
		text: Text,
		background: ColorWithAlpha,
		outline: t.optional(Outline),
		tween: t.interface({
			style: TweenStyle,
			direction: TweenDirection,
			time: t.number,
		}),
		hover: t.interface({
			background: t.optional(ColorWithAlpha),
		}),
		pressed: t.interface({
			background: t.optional(ColorWithAlpha),
		}),
	});
	
	export type Container = t.static<typeof Container>;
	export const Container = t.interface({
		background: t.union(ColorWithAlpha, Gradient),
		outline: t.optional(Outline),
	});
	
	export type Data = t.static<typeof Data>;
	export const Data = t.interface({
		version: t.literal(1),
		hud: t.interface({
			text: t.interface({
				altitude: t.intersection(Text, FloatDisplay),
				speedometer: t.intersection(Text, FloatDisplay),
				moveHint: Text,
			}),
		}),
		timer: t.interface({
			text: t.intersection(Text, t.interface({
				display: t.interface({
					milliseconds: t.interface({
						fontSize: t.number,
						autoScale: t.boolean,
					}),
				}),
			})),
		}),
		subtitles: t.interface({
			text: Text,
			container: Container,
		}),
		modal: t.interface({
			container: Container,
			text: t.interface({
				title: Text,
				body: t.interface({
					header: Text,
					paragraph: Text,
				}),
			}),
			actionButton: ButtonWithInteraction,
		}),
		sideMenu: t.interface({
			container: Container,
			button: ButtonWithIcon,
		}),
		startScreen: t.interface({
			logo: Text,
			button: ButtonWithIcon,
			loading: t.interface({
				background: t.union(Color, Gradient),
				logo: Text,
				status: Text,
				percentage: Text,
			}),
		}),
		world: t.interface({
			nameplate: t.interface({
				displayName: Text,
				username: Text,
			}),
		}),
		centurion: t.interface({
			text: t.interface({
				bold: Font,
				medium: Font,
				regular: Font,
			}),
		}),
		controller: t.interface({
			selectionOutline: Outline,
		}),
		misc: t.interface({
			text: t.interface({
				version: Text,
			}),
		}),
		layout: t.interface({}), // TODO: ui layout
	});
	
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
