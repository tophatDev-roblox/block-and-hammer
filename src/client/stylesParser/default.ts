import { GradientStyleData, StylesData } from '.';

const fontId = 'rbxassetid://12187365364';

const textOutlineGradient: GradientStyleData = {
	colors: [
		{ position: 0, color: { red: 0, green: 0, blue: 0 } },
		{ position: 1, color: { red: 0, green: 0, blue: 0 } },
	],
	transparency: [
		{ position: 0, transparency: 0 },
		{ position: 1, transparency: 0.7 },
	],
	rotation: -90,
};

const data: StylesData = {
	version: 1,
	text: {
		containerTitle: {
			font: { fontId, weight: 700, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 50,
			outline: false,
		},
		version: {
			font: { fontId, weight: 700, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
			size: 16,
			outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter', autoScale: false },
			autoScale: false,
		},
		timer: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 70,
			outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
		},
		timerMillisecondsFontSize: 45,
		moveHint: {
			font: { fontId, weight: 700, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
			size: 35,
			outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
		},
		hudPrimary: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 70,
			outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
			display: {
				decimals: 1,
			},
		},
		hudSecondary: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 200, green: 200, blue: 200, alpha: 1 },
			size: 45,
			outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
			display: {
				decimals: 1,
			},
		},
		centurion: {
			bold: { fontId, weight: 700, italics: false },
			medium: { fontId, weight: 500, italics: false },
			regular: { fontId, weight: 400, italics: false },
		},
	},
	container: {
		background: {
			colors: [
				{ position: 1, color: { red: 34, green: 34, blue: 34 } },
				{ position: 0.6, color: { red: 0, green: 0, blue: 0 } },
				{ position: 1, color: { red: 0, green: 0, blue: 0 } },
			],
			transparency: [
				{ position: 0, transparency: 0 },
				{ position: 1, transparency: 0 },
			],
			rotation: 60,
		},
		outline: {
			color: {
				colors: [
					{ position: 0, color: { red: 255, green: 255, blue: 255 } },
					{ position: 1, color: { red: 255, green: 255, blue: 255 } },
				],
				transparency: [
					{ position: 0, transparency: 0.2 },
					{ position: 1, transparency: 0.7 },
				],
				rotation: -90,
			},
			thickness: 3,
			joinMode: 'miter',
		},
	},
	button: {
		primary: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 50,
				outline: false,
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: false,
		},
		secondary: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 50,
				outline: false,
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: false,
		},
	},
	layout: {},
};

export = data;
