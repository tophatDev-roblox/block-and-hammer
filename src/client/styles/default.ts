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
	hud: {
		text: {
			altitude: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
				display: {
					decimals: 1,
				},
			},
			speedometer: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 200, green: 200, blue: 200, alpha: 1 },
				size: 35,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
				display: {
					decimals: 1,
				},
			},
			moveHint: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
				size: 25,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
			},
		},
	},
	timer: {
		text: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 60,
			outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
			display: {
				milliseconds: {
					fontSize: 35,
				},
			},
		},
	},
	sideMenu: {
		container: {
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
		button: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
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
	startScreen: {
		logo: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 80,
			outline: { color: { red: 0, green: 0, blue: 0, alpha: 1 }, thickness: 6, joinMode: 'miter' },
		},
		button: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
				outline: false,
			},
			icon: {
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				background: { red: 255, green: 255, blue: 255, alpha: 0.06 },
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: false,
		},
		loading: {
			background: { red: 0, green: 0, blue: 0 },
			logo: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 70,
				outline: false,
			},
			status: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 200, green: 200, blue: 200, alpha: 1 },
				size: 50,
				outline: false,
			},
			percentage: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 40,
				outline: false,
			},
		},
	},
	world: {
		nameplate: {
			displayName: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 25,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
			},
			username: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 15,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter' },
			},
		},
	},
	centurion: {
		text: {
			bold: { fontId, weight: 700, italics: false },
			medium: { fontId, weight: 500, italics: false },
			regular: { fontId, weight: 400, italics: false },
		},
	},
	controller: {
		selectionOutline: {
			color: {
				rotation: {
					rotationsPerSecond: 0.3,
				},
				colors: [
					{ position: 0, color: { red: 74, green: 136, blue: 237 } },
					{ position: 1, color: { red: 14, green: 64, blue: 144 } },
				],
				transparency: [
					{ position: 0, transparency: 0 },
					{ position: 1, transparency: 0 },
				],
			},
			thickness: 4,
			joinMode: 'round',
		},
	},
	misc: {
		text: {
			version: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
				size: 16,
				outline: { color: textOutlineGradient, thickness: 1, joinMode: 'miter', autoScale: false },
				autoScale: false,
			},
		},
	},
	layout: {},
};

export = data;
