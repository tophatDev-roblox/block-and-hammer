import { GradientStyleData, StylesData } from '.';

const fontId = 'rbxassetid://12187365364';

const textOutlineGradient: GradientStyleData = {
	colors: { 0: { red: 0, green: 0, blue: 0 }, 1: { red: 0, green: 0, blue: 0 } },
	transparency: { 0: 0, 1: 0.7 },
	rotation: -90,
};

const data: StylesData = {
	version: 1,
	text: {
		containerTitle: {
			font: { fontId, weight: 700, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 32,
			outline: false,
		},
		version: {
			font: { fontId, weight: 700, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
			size: 16,
			outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter' },
		},
		timer: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 40,
			outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter' },
		},
		timerMillisecondsFontSize: 25,
		hudPrimary: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 40,
			outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter' },
			decimals: 1,
		},
		hudSecondary: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 200, green: 200, blue: 200, alpha: 1 },
			size: 25,
			outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter' },
			decimals: 1,
		},
		centurion: {
			bold: { fontId, weight: 700, italics: false },
			medium: { fontId, weight: 500, italics: false },
			regular: { fontId, weight: 400, italics: false },
		},
	},
	container: {
		background: {
			colors: { 0: { red: 34, green: 34, blue: 34 }, 0.6: { red: 0, green: 0, blue: 0 }, 1: { red: 0, green: 0, blue: 0 } },
			transparency: { 0: 0, 1: 0 },
			rotation: 60,
		},
		outline: {
			color: {
				colors: { 0: { red: 255, green: 255, blue: 255 }, 1: { red: 255, green: 255, blue: 255 } },
				transparency: { 0: 0.2, 1: 0.7 },
				rotation: -90,
			},
			thickness: 1,
			joinMode: 'miter',
		},
	},
	button: {
		primary: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 30,
				outline: false,
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: false,
		},
		secondary: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 30,
				outline: false,
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: false,
		},
	},
	layout: {},
};

export = data;
