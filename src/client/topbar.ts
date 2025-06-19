import { Players, RunService } from '@rbxts/services';
import { effect } from '@rbxts/charm';

import Icon from 'shared/Icon';
import NumberSpinner from 'shared/NumberSpinner';
import { MaxDollars, MinDollars, TestingPlaceId } from 'shared/constants';
import { StylesData } from './stylesParser';
import defaultStyles from './stylesParser/default';
import { InputType, inputType } from './inputType';
import { isMenuOpen } from './ui/gameProvider';

const client = Players.LocalPlayer;

const dollarsNumber = new NumberSpinner();
dollarsNumber.Value = 0;
dollarsNumber.Decimals = 0;
dollarsNumber.Commas = true;

const theme = [
	['IconLabel', 'TextSize', 26],
	['IconLabel', 'FontFace', new Font('rbxassetid://12187365364', Enum.FontWeight.ExtraBold, Enum.FontStyle.Normal)],
	['IconImageScale', 'Value', 0.9],
	['IconCorners', 'CornerRadius', new UDim(0, 8)],
	['IconOverlay', 'BackgroundTransparency', 1],
	['IconButton', 'BackgroundTransparency', 0.4],
	['IconButton', 'BackgroundColor3', Color3.fromRGB(255, 255, 255)],
	['IconGradient', 'Enabled', true],
	['IconGradient', 'Rotation', 60],
	['IconGradient', 'Color', new ColorSequence(Color3.fromRGB(34, 34, 34), Color3.fromRGB(0, 0, 0)), 'Deselected'],
	['IconGradient', 'Color', new ColorSequence(Color3.fromRGB(54, 54, 54), Color3.fromRGB(20, 20, 20)), 'Viewing'],
	['IconGradient', 'Color', new ColorSequence(Color3.fromRGB(69, 69, 69), Color3.fromRGB(35, 35, 35)), 'Selected'],
];

Icon.modifyBaseTheme(theme);

const menuIcon = new Icon()
	.setImage(79239443855874)
	.setCaption('Toggle menu')
	.bindToggleKey(Enum.KeyCode.B)
	.bindToggleKey(Enum.KeyCode.ButtonB)
	.setOrder(0)
	.autoDeselect(false)
	.modifyTheme(theme);

const dollarsIcon = new Icon()
	.convertLabelToNumberSpinner(dollarsNumber)
	.setCaption('Open shop')
	.oneClick(true)
	.setOrder(10)
	.modifyTheme(theme)
	.modifyTheme([
		['PaddingLeft', 'Size', new UDim2(0, 24, 1, 0)],
		['PaddingRight', 'Size', new UDim2(0, 24, 1, 0)],
	]);

menuIcon.toggled.Connect((toggled) => {
	isMenuOpen(toggled);
});

dollarsIcon.selected.Connect(() => {
	menuIcon.select();
});

effect(() => {
	if (isMenuOpen()) {
		menuIcon.select();
	} else {
		menuIcon.deselect();
	}
});

effect(() => {
	const currentInputType = inputType();
	switch (currentInputType) {
		case InputType.Desktop: {
			menuIcon.setCaptionHint(Enum.KeyCode.B);
			break;
		}
		case InputType.Touch: {
			menuIcon.setCaptionHint(Enum.KeyCode.Unknown);
			break;
		}
		case InputType.Controller: {
			menuIcon.setCaptionHint(Enum.KeyCode.ButtonB);
			break;
		}
		case InputType.Unknown: {
			menuIcon.setCaptionHint(Enum.KeyCode.Unknown);
			break;
		}
	}
});

if (RunService.IsStudio() || game.PlaceId === TestingPlaceId) {
	const debugIcon = new Icon()
		.setImage(6953984446)
		.setCaption('Open debug panel')
		.setOrder(9)
		.autoDeselect(false)
		.modifyTheme(theme)
		.modifyTheme(['IconImageScale', 'Value', 0.7]);
	
	debugIcon.selected.Connect(() => {
		print('open debug panel');
	});
	
	debugIcon.deselected.Connect(() => {
		print('close debug panel');
	});
}

function applyStyles(_styles: StylesData): void {
	// TODO: apply ui styles to topbar
}

function onAttributeChanged(attribute: string) {
	if (attribute !== 'dollars') {
		return;
	}
	
	dollarsNumber.Value = math.clamp(client.GetAttribute(attribute) as number | undefined ?? 0, MinDollars, MaxDollars);
}

applyStyles(defaultStyles);
onAttributeChanged('dollars');

client.AttributeChanged.Connect(onAttributeChanged);
