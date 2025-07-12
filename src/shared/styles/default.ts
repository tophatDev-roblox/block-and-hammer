import { Assets } from 'shared/assets';

import { Styles } from '.';

const fontId = Assets.Fonts.Inter;

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
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
				autoScale: true,
				display: {
					decimals: 1,
				},
			},
			speedometer: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 200, green: 200, blue: 200, alpha: 1 },
				size: 35,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
				autoScale: true,
				display: {
					decimals: 1,
				},
			},
			moveHint: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 0.7 },
				size: 25,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
				autoScale: true,
			},
		},
		statusEffects: {
			icons: {
				background: { red: 0, green: 0, blue: 0, alpha: 0.6 },
				outline: undefined,
				progress: { red: 255, green: 255, blue: 255, alpha: 0.07 },
				size: 60,
				autoScale: true,
			},
		},
	},
	timer: {
		text: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 60,
			outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
			autoScale: true,
			display: {
				milliseconds: {
					fontSize: 35,
					autoScale: true,
				},
			},
		},
	},
	subtitles: {
		text: {
			font: { fontId, weight: 400, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 30,
			outline: undefined,
			autoScale: true,
		},
		container: {
			background: { red: 0, green: 0, blue: 0, alpha: 1 },
			outline: undefined,
		},
	},
	modal: {
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
			outline: undefined,
		},
		text: {
			title: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 80,
				outline: undefined,
				autoScale: true,
			},
			body: {
				header: {
					font: { fontId, weight: 700, italics: false },
					color: { red: 255, green: 255, blue: 255, alpha: 1 },
					size: 50,
					outline: undefined,
					autoScale: true,
				},
				paragraph: {
					font: { fontId, weight: 700, italics: false },
					color: { red: 255, green: 255, blue: 255, alpha: 1 },
					size: 40,
					outline: undefined,
					autoScale: true,
				},
			},
		},
		actionButton: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
				outline: undefined,
				autoScale: true,
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.3 },
			outline: undefined,
			tween: {
				style: 'linear',
				direction: 'out',
				time: 0.2,
			},
			hover: {
				background: { red: 255, green: 255, blue: 255, alpha: 0.1 },
			},
			pressed: {
				background: { red: 255, green: 255, blue: 255, alpha: 0.2 },
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
			outline: undefined,
		},
		button: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
				outline: undefined,
				autoScale: true,
			},
			icon: {
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				background: { red: 255, green: 255, blue: 255, alpha: 0.06 },
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.3 },
			outline: undefined,
		},
	},
	startScreen: {
		logo: {
			font: { fontId, weight: 900, italics: false },
			color: { red: 255, green: 255, blue: 255, alpha: 1 },
			size: 80,
			outline: { color: { red: 0, green: 0, blue: 0, alpha: 1 }, thickness: 6, joinMode: 'miter', autoScale: true },
			autoScale: true,
		},
		button: {
			text: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 60,
				outline: undefined,
				autoScale: true,
			},
			icon: {
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				background: { red: 255, green: 255, blue: 255, alpha: 0.06 },
			},
			background: { red: 0, green: 0, blue: 0, alpha: 0.5 },
			outline: undefined,
		},
		loading: {
			background: { red: 0, green: 0, blue: 0 },
			logo: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 70,
				outline: undefined,
				autoScale: true,
			},
			status: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 200, green: 200, blue: 200, alpha: 1 },
				size: 50,
				outline: undefined,
				autoScale: true,
			},
			percentage: {
				font: { fontId, weight: 900, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 40,
				outline: undefined,
				autoScale: true,
			},
		},
	},
	world: {
		nameplate: {
			displayName: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 255, green: 255, blue: 255, alpha: 1 },
				size: 30,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
				autoScale: true,
			},
			username: {
				font: { fontId, weight: 700, italics: false },
				color: { red: 200, green: 200, blue: 200, alpha: 1 },
				size: 20,
				outline: { color: textOutlineGradient, thickness: 2, joinMode: 'miter', autoScale: true },
				autoScale: true,
			},
			icons: {
				size: 26,
				autoScale: true,
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
			autoScale: true,
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
