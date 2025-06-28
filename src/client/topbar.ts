import { Players } from '@rbxts/services';
import { subscribe } from '@rbxts/charm';

import Icon from 'shared/Icon';
import NumberSpinner from 'shared/NumberSpinner';
import { IsDebugPanelEnabled, MaxDollars, MinDollars } from 'shared/constants';
import { Styles } from 'client/stylesParser';
import defaultStyles from 'client/stylesParser/default';
import { InputType, inputTypeAtom } from 'client/inputType';
import { isDebugPanelOpenAtom } from 'client/debugPanel';
import { sideMenuOpenedAtom } from 'client/sideMenu';

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
	sideMenuOpenedAtom(toggled);
});

dollarsIcon.selected.Connect(() => {
	menuIcon.select();
});

subscribe(sideMenuOpenedAtom, (sideMenuOpened) => {
	if (sideMenuOpened) {
		menuIcon.select();
	} else {
		menuIcon.deselect();
	}
});

subscribe(inputTypeAtom, (inputType) => {
	switch (inputType) {
		case InputType.Desktop: {
			menuIcon.setCaptionHint(Enum.KeyCode.B);
			break;
		}
		case InputType.Controller: {
			menuIcon.setCaptionHint(Enum.KeyCode.ButtonB);
			break;
		}
		case InputType.Touch:
		case InputType.Unknown: {
			menuIcon.setCaptionHint(Enum.KeyCode.Unknown);
			break;
		}
	}
});

if (IsDebugPanelEnabled) {
	const debugIcon = new Icon()
		.setImage(6953984446)
		.setCaption('Open debug panel')
		.bindToggleKey(Enum.KeyCode.Quote)
		.setOrder(9)
		.autoDeselect(false)
		.modifyTheme(theme)
		.modifyTheme(['IconImageScale', 'Value', 0.7]);
	
	subscribe(isDebugPanelOpenAtom, (isDebugPanelOpen) => {
		if (isDebugPanelOpen) {
			debugIcon.select();
		} else {
			debugIcon.deselect();
		}
	});
	
	debugIcon.selected.Connect(() => {
		isDebugPanelOpenAtom(true);
	});
	
	debugIcon.deselected.Connect(() => {
		isDebugPanelOpenAtom(false);
	});
}

function applyStyles(_styles: Styles.Data): void {
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
