export namespace Styles {
	const fontRegular = new Font('rbxassetid://12187365364', Enum.FontWeight.Regular, Enum.FontStyle.Normal);
	const fontMedium = new Font('rbxassetid://12187365364', Enum.FontWeight.Medium, Enum.FontStyle.Normal);
	const fontSemiBold = new Font('rbxassetid://12187365364', Enum.FontWeight.SemiBold, Enum.FontStyle.Normal);
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
		} else {
			props.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
			props.BackgroundTransparency = 0;
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
		} else {
			props.ImageColor3 = Color3.fromRGB(255, 255, 255);
			props.ImageTransparency = 0;
		}
		
		return props;
	};
	
	export const applyTextColorProps = (color: Color | Gradient): object => {
		const props: React.InstanceProps<TextLabel> = {
			BackgroundTransparency: 1,
			BorderSizePixel: 0,
		};
		
		if (color.type === 'plain') {
			props.TextColor3 = color.color;
			props.BackgroundTransparency = 1 - (color.alpha ?? 0);
		} else {
			props.TextColor3 = Color3.fromRGB(255, 255, 255);
			props.BackgroundTransparency = 0;
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
	
	export const createUniformColorSequence = (...colors: Array<Color3>): ColorSequence => {
		const keypoints = new Array<ColorSequenceKeypoint>();
		
		for (const [i, color] of ipairs(colors)) {
			keypoints.push(new ColorSequenceKeypoint(math.map(i, 1, colors.size(), 0, 1), color));
		}
		
		return new ColorSequence(keypoints);
	};
	
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
	
	export interface TextPlain extends Omit<Text, 'color'> {
		color: Color;
	}
	
	export interface ButtonText {
		background: Color | Gradient;
		icon: {
			background: Color | Gradient;
			color: Color | Gradient;
		};
		padding: number;
		text: Text;
		outline?: Outline;
	}
	
	export interface ButtonIcon extends Omit<ButtonText, 'text' | 'icon'> {
		icon: {
			color: Color | Gradient;
		};
		size: number;
	}
	
	export interface UI {
		loadingScreen: {
			gap: number;
			background: Color;
			title: Text;
			status: Text;
			progressBar: {
				loadedColor: Color;
				unloadedColor: Color;
			};
		};
		startScreen: {
			gap: number;
			title: Text;
		};
		sideButton: ButtonText;
		hud: {
			padding: number;
			gap: number;
			altitude: Text;
			speedometer: Text;
			timer: Text;
			timerUnstarted: Text;
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
				};
				dropdown: {
					itemText: Text;
					padding: number;
				};
				slider: {
					input: TextPlain;
					placeholder: Color;
					thumb: Color | Gradient;
					padding: number;
				};
			};
		};
		version: Text;
		world: {
			nameplate: {
				displayName: Text;
				username: Text;
				gap: number;
			};
		};
		inventory: {
			padding: number;
			gap: number;
			buttons: {
				gap: number;
				button: {
					padding: number;
					background: Color;
					backgroundHover: Color;
					image: Color | Gradient;
				};
			};
			tabs: {
				gap: number;
				tab: {
					padding: number;
					text: Text;
					background: Color;
					borderRadius: number;
					backgroundHover: Color;
					borderRadiusHover: number;
					backgroundSelected: Color;
					borderRadiusSelected: number;
				};
			};
			content: {
				accessories: {
					gap: number;
					categories: {
						padding: number;
						gap: number;
						borderRadius: number;
						background: Color | Gradient;
						category: {
							padding: number;
							borderRadius: number;
							background: Color | Gradient;
							icon: Color | Gradient;
							selected: {
								borderRadius: number;
								background: Color;
							};
						};
					};
					listing: {
						padding: number;
						gap: number;
						borderRadius: number;
						background: Color | Gradient;
						accessory: {
							gap: number;
							borderRadius: number;
							width: number;
							background: Color | Gradient;
							info: {
								padding: number;
								background: Color | Gradient;
								text: Text;
							};
						};
					};
					selection: {
						padding: number;
						gap: number;
						borderRadius: number;
						background: Color | Gradient;
						preview: {
							background: Color | Gradient;
							borderRadius: number;
						};
						name: Text;
						description: Text;
						badges: {
							padding: number;
							gap: number;
							badge: {
								padding: number;
								gap: number;
								borderRadius: number;
								background: Color | Gradient;
							};
							price: {
								currency: Text;
								amount: Text;
							};
						};
						buttons: {
							borderRadius: number;
							purchase: Omit<ButtonText, 'icon'>;
							equip: Omit<ButtonText, 'icon'>;
							unequip: Omit<ButtonText, 'icon'>;
						};
					};
				};
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
			gap: 20,
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
			progressBar: {
				loadedColor: plainColor(Color3.fromRGB(210, 210, 210)),
				unloadedColor: plainColor(Color3.fromRGB(255, 255, 255), 0.1),
			},
		},
		startScreen: {
			gap: 10,
			title: {
				font: fontHeavy,
				size: 60,
				color: plainColor(Color3.fromRGB(255, 255, 255)),
				outline: {
					...genericTextOutline,
					thickness: 5,
				},
			},
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
			padding: 5,
			gap: 5,
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
				dropdown: {
					itemText: {
						font: fontBold,
						color: plainColor(Color3.fromRGB(255, 255, 255)),
						size: 40,
					},
					padding: 5,
				},
				slider: {
					input: {
						font: fontBold,
						color: plainColor(Color3.fromRGB(255, 255, 255)),
						size: 35,
					},
					placeholder: plainColor(Color3.fromRGB(128, 128, 128)),
					thumb: plainColor(Color3.fromRGB(71, 130, 255)),
					padding: 10,
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
				gap: 5,
			},
		},
		inventory: {
			padding: 20,
			gap: 20,
			buttons: {
				gap: 20,
				button: {
					padding: 10,
					background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
					backgroundHover: plainColor(Color3.fromRGB(0, 0, 0), 0.2),
					image: plainColor(Color3.fromRGB(255, 255, 255), 1),
				},
			},
			tabs: {
				gap: 20,
				tab: {
					padding: 20,
					text: {
						font: fontBold,
						color: plainColor(Color3.fromRGB(255, 255, 255)),
						size: 45,
					},
					background: plainColor(Color3.fromRGB(0, 0, 0), 0.6),
					borderRadius: 50,
					backgroundHover: plainColor(Color3.fromRGB(0, 0, 0), 0.4),
					borderRadiusHover: 50,
					backgroundSelected: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
					borderRadiusSelected: 20,
				},
			},
			content: {
				accessories: {
					gap: 20,
					categories: {
						padding: 10,
						gap: 10,
						borderRadius: 30,
						background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
						category: {
							padding: 10,
							borderRadius: 20,
							background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
							icon: plainColor(Color3.fromRGB(255, 255, 255), 0.7),
							selected: {
								borderRadius: 10,
								background: plainColor(Color3.fromRGB(255, 255, 255), 0.05),
							},
						},
					},
					listing: {
						padding: 10,
						gap: 10,
						borderRadius: 30,
						background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
						accessory: {
							gap: 0,
							borderRadius: 20,
							width: 200,
							background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
							info: {
								padding: 5,
								background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
								text: {
									font: fontSemiBold,
									color: plainColor(Color3.fromRGB(255, 255, 255)),
									size: 30,
								},
							},
						},
					},
					selection: {
						padding: 10,
						gap: 10,
						borderRadius: 30,
						background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
						preview: {
							background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
							borderRadius: 20,
						},
						name: {
							font: fontSemiBold,
							color: plainColor(Color3.fromRGB(255, 255, 255)),
							size: 40,
						},
						description: {
							font: fontRegular,
							color: plainColor(Color3.fromRGB(255, 255, 255)),
							size: 30,
						},
						badges: {
							padding: 0,
							gap: 10,
							badge: {
								padding: 10,
								gap: 3,
								borderRadius: 10,
								background: plainColor(Color3.fromRGB(0, 0, 0), 0.3),
							},
							price: {
								currency: {
									font: fontExtraBold,
									color: plainColor(Color3.fromRGB(147, 235, 143)),
									size: 25,
								},
								amount: {
									font: fontExtraBold,
									color: plainColor(Color3.fromRGB(255, 255, 255)),
									size: 35,
								},
							},
						},
						buttons: {
							borderRadius: 20,
							purchase: {
								background: gradientColor(createUniformColorSequence(
									Color3.fromRGB(80, 220, 150),
									Color3.fromRGB(166, 237, 201),
									Color3.fromRGB(80, 220, 150),
								), new NumberSequence(0), 30),
								padding: 10,
								text: {
									font: fontHeavy,
									color: plainColor(Color3.fromRGB(255, 255, 255)),
									size: 40,
									outline: genericTextOutline,
								},
							},
							equip: {
								background: gradientColor(createUniformColorSequence(
									Color3.fromRGB(80, 145, 220),
									Color3.fromRGB(166, 199, 237),
									Color3.fromRGB(80, 145, 220),
								), new NumberSequence(0), 30),
								padding: 10,
								text: {
									font: fontHeavy,
									color: plainColor(Color3.fromRGB(255, 255, 255)),
									size: 40,
									outline: genericTextOutline,
								},
							},
							unequip: {
								background: gradientColor(createUniformColorSequence(
									Color3.fromRGB(80, 215, 220),
									Color3.fromRGB(166, 235, 237),
									Color3.fromRGB(80, 215, 220),
								), new NumberSequence(0), 30),
								padding: 10,
								text: {
									font: fontHeavy,
									color: plainColor(Color3.fromRGB(255, 255, 255)),
									size: 40,
									outline: genericTextOutline,
								},
							},
						},
					},
				},
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
