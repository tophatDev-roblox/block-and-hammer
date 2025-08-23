export namespace Styles {
	const fontRegular = new Font('rbxassetid://12187365364', Enum.FontWeight.Regular, Enum.FontStyle.Normal);
	const fontMedium = new Font('rbxassetid://12187365364', Enum.FontWeight.Medium, Enum.FontStyle.Normal);
	const fontBold = new Font('rbxassetid://12187365364', Enum.FontWeight.Bold, Enum.FontStyle.Normal);
	const fontExtraBold = new Font('rbxassetid://12187365364', Enum.FontWeight.ExtraBold, Enum.FontStyle.Normal);
	const fontHeavy = new Font('rbxassetid://12187365364', Enum.FontWeight.Heavy, Enum.FontStyle.Normal);
	
	export const applyBackgroundColorProps = (color: Color | Gradient): object => {
		const props: React.InstanceProps<GuiObject> = {
			BorderSizePixel: 0,
		};
		
		if (color.type === 'plain') {
			props.BackgroundColor3 = color.color;
			props.BackgroundTransparency = 1 - (color.alpha ?? 0);
		}
		
		return props;
	};
	
	export const applyImageColorProps = (color: Color | Gradient): object => {
		const props: React.InstanceProps<ImageButton> = {
			BackgroundTransparency: 1,
			BorderSizePixel: 0,
		};
		
		if (color.type === 'plain') {
			props.ImageColor3 = color.color;
			props.ImageTransparency = 1 - (color.alpha ?? 0);
		}
		
		return props;
	};
	
	export const plainColor = (color: Color3, alpha: number = 1): Color => ({
		type: 'plain',
		color,
		alpha,
	});
	
	export const gradientColor = (color: ColorSequence, transparency: NumberSequence, rotation?: number, rotationsPerSecond?: number): Gradient => ({
		type: 'gradient',
		color,
		transparency,
		rotation,
		rotationsPerSecond,
	});
	
	export interface Color {
		type: 'plain';
		color: Color3;
		alpha: number;
	}
	
	export interface AutoScale {
		autoScale?: boolean;
	}
	
	export interface Gradient {
		type: 'gradient';
		color?: ColorSequence;
		transparency?: NumberSequence;
		rotation?: number;
		rotationsPerSecond?: number;
	}
	
	export interface Outline extends AutoScale {
		color: Color | Gradient;
		joinMode: Enum.LineJoinMode;
		thickness: number;
	}
	
	export interface Text extends AutoScale {
		color: Color | Gradient;
		size: number;
		font: Font;
		outline?: Outline;
	}
	
	export interface Button {
		background: Color | Gradient;
		icon: {
			background: Color | Gradient;
			color: Color | Gradient;
		};
		padding: number;
		text: Text;
		outline?: Outline;
	}
	
	export interface UI {
		loadingScreen: {
			background: Color;
			listPadding: number;
			title: Text;
			status: Text;
			progressBar: {
				loadedColor: Color;
				unloadedColor: Color;
			};
		};
		startScreen: {
			title: Text;
			listPadding: number;
		};
		sideButton: Button;
		hud: {
			altitude: Text;
			speedometer: Text;
			timer: Text;
			timerUnstarted: Text;
			padding: number;
			listPadding: number;
		};
		sideMenu: {
			background: Color | Gradient;
		};
		panel: {
			background: Color | Gradient;
			settings: {
				item: {
					background: Color | Gradient;
					label: Text;
					padding: number;
				};
				checkbox: {
					padding: number;
				}
			};
		};
		version: Text;
		world: {
			nameplate: {
				displayName: Text;
				username: Text;
				listPadding: number;
			};
		};
	}
	
	const genericTextOutline: Outline = {
		color: gradientColor(new ColorSequence(Color3.fromRGB(0, 0, 0)), new NumberSequence(0, 0.4), -90),
		joinMode: Enum.LineJoinMode.Miter,
		thickness: 3,
	};
	
	export const UI: UI = {
		loadingScreen: {
			background: plainColor(Color3.fromRGB(0, 0, 0)),
			title: {
				font: fontHeavy,
				size: 70,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
			},
			status: {
				font: fontBold,
				size: 25,
				color: plainColor(Color3.fromRGB(210, 210, 210)),
			},
			listPadding: 20,
			progressBar: {
				loadedColor: plainColor(Color3.fromRGB(210, 210, 210)),
				unloadedColor: plainColor(Color3.fromRGB(255, 255, 255), 0.1),
			},
		},
		startScreen: {
			title: {
				font: fontHeavy,
				size: 60,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
				outline: {
					...genericTextOutline,
					thickness: 5,
				},
			},
			listPadding: 10,
		},
		sideButton: {
			background: gradientColor(new ColorSequence(Color3.fromRGB(0, 0, 0)), new NumberSequence(0.4, 0.6), -90),
			icon: {
				background: plainColor(Color3.fromRGB(0, 0, 0), 0.4),
				color: plainColor(Color3.fromRGB(255, 255, 255)),
			},
			padding: 8,
			text: {
				font: fontBold,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
				size: 45,
			},
		},
		hud: {
			speedometer: {
				font: fontHeavy,
				color: plainColor(Color3.fromRGB(255, 255, 255), 0.6),
				outline: genericTextOutline,
				size: 30,
			},
			altitude: {
				font: fontHeavy,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
				outline: genericTextOutline,
				size: 40,
			},
			timer: {
				font: fontHeavy,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
				outline: genericTextOutline,
				size: 50,
			},
			timerUnstarted: {
				font: fontHeavy,
				color: plainColor(Color3.fromRGB(255, 255, 255), 0.6),
				outline: genericTextOutline,
				size: 50,
			},
			padding: 5,
			listPadding: 5,
		},
		sideMenu: {
			background: gradientColor(new ColorSequence(Color3.fromRGB(0, 0, 0)), new NumberSequence(0.5, 0.8), 20),
		},
		panel: {
			background: gradientColor(new ColorSequence(Color3.fromRGB(0, 0, 0)), new NumberSequence(0.5, 0.8), 20),
			settings: {
				item: {
					background: gradientColor(new ColorSequence(Color3.fromRGB(0, 0, 0)), new NumberSequence(0.5, 0.8), 20),
					label: {
						font: fontHeavy,
						color: plainColor(Color3.fromRGB(255, 255, 255)),
						size: 45,
					},
					padding: 10,
				},
				checkbox: {
					padding: 5,
				},
			},
		},
		version: {
			font: fontHeavy,
			color: plainColor(Color3.fromRGB(255, 255, 255), 0.6),
			outline: genericTextOutline,
			size: 30,
		},
		world: {
			nameplate: {
				displayName: {
					font: fontExtraBold,
					color: plainColor(Color3.fromRGB(255, 255, 255), 1),
					outline: genericTextOutline,
					size: 30,
				},
				username: {
					font: fontExtraBold,
					color: plainColor(Color3.fromRGB(255, 255, 255), 0.6),
					outline: genericTextOutline,
					size: 20,
				},
				listPadding: 5,
			},
		},
	};
	
	export interface Centurion {
		text: {
			regular: Font;
			medium: Font;
			bold: Font;
		};
	}
	
	export const Centurion: Centurion = {
		text: {
			regular: fontRegular,
			medium: fontMedium,
			bold: fontBold,
		},
	};
	
	export interface Topbar {
		// TODO: topbar styles
	}
	
	export const Topbar: Topbar = {
		
	};
}
