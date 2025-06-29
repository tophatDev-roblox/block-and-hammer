import { Styles } from '.';

const fontId = 'rbxassetid://12187365364';

const textOutlineGradient: Styles.Gradient = {
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

const data: Styles.Data = {
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
			display: {
				millisecondsFontSize: 45,
			},
		},
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
	world: {
		nameplate: {
			displayName: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 35,
				outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
			},
			username: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 25,
				outline: { color: textOutlineGradient, thickness: 3, joinMode: 'miter' },
			},
		},
	},
	controller: {
		selectionOutline: {
			color: {
				rotation: {
					rotationsPerSecond: 0.3,
				},
				colors: [
					{ position: 0, color: { red: 255, green: 255, blue: 255 } },
					{ position: 1, color: { red: 86, green: 86, blue: 86 } },
				],
				transparency: [
					{ position: 0, transparency: 0 },
					{ position: 1, transparency: 0 },
				],
			},
			thickness: 6,
			joinMode: 'round',
		},
	},
	containers: {
		sideMenu: {
			background: {
				colors: [
					{ position: 0, color: { red: 34, green: 34, blue: 34 } },
					{ position: 0.6, color: { red: 0, green: 0, blue: 0 } },
					{ position: 1, color: { red: 0, green: 0, blue: 0 } },
				],
				transparency: [
					{ position: 0, transparency: 0.4 },
					{ position: 1, transparency: 0.4 },
				],
				rotation: 60,
			},
			outline: false,
		},
	},
	buttons: {
		sideMenu: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 70,
				outline: false,
			},
			icon: {
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				background: { red: 255, green: 255, blue: 255, alpha: 0.06 },
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.3 },
			outline: false,
		},
	},
	layout: {},
};

export = data;
