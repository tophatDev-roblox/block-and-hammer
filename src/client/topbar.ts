import { Players } from '@rbxts/services';
import { effect, subscribe } from '@rbxts/charm';

import Icon from 'shared/Icon';
import NumberSpinner from 'shared/NumberSpinner';
import { IsDebugPanelEnabled, MaxDollars, MinDollars } from 'shared/constants';
import { Styles } from 'client/styles';
import { InputType } from 'client/inputType';
import { DebugPanel } from 'client/debugPanel';
import { SideMenuState } from 'client/sideMenuState';
import { StartScreenState } from './startScreenState';
import defaultStyles from 'client/styles/default';

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

Icon.setDisplayOrder(100);
Icon.modifyBaseTheme(theme);

const menuIcon = new Icon()
	.setImage(79239443855874)
	.setCaption('Toggle menu')
	.bindToggleKey(Enum.KeyCode.ButtonB)
	.bindToggleKey(Enum.KeyCode.B)
	.setOrder(0)
	.autoDeselect(false)
	.modifyTheme(theme);

new Icon()
	.convertLabelToNumberSpinner(dollarsNumber)
	.setOrder(10)
	.lock()
	.modifyTheme(theme)
	.modifyTheme([
		['PaddingLeft', 'Size', new UDim2(0, 24, 1, 0)],
		['PaddingRight', 'Size', new UDim2(0, 24, 1, 0)],
	]);

menuIcon.toggled.Connect((toggled) => {
	SideMenuState.isOpenAtom(toggled);
});

subscribe(SideMenuState.isOpenAtom, (isOpen) => {
	if (isOpen) {
		menuIcon.select();
	} else {
		menuIcon.deselect();
	}
});

effect(() => {
	const isVisible = StartScreenState.isVisibleAtom();
	if (isVisible) {
		menuIcon.lock();
	} else {
		menuIcon.unlock();
	}
});

effect(() => {
	const inputType = InputType.stateAtom();
	switch (inputType) {
		case InputType.Value.Desktop: {
			menuIcon.setCaptionHint(Enum.KeyCode.B);
			break;
		}
		case InputType.Value.Controller: {
			menuIcon.setCaptionHint(Enum.KeyCode.ButtonB);
			break;
		}
		case InputType.Value.Touch:
		case InputType.Value.Unknown: {
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
	
	subscribe(DebugPanel.isOpenAtom, (isOpen) => {
		if (isOpen) {
			debugIcon.select();
		} else {
			debugIcon.deselect();
		}
	});
	
	effect(() => {
		const isVisible = StartScreenState.isVisibleAtom();
		if (isVisible) {
			debugIcon.lock();
		} else {
			debugIcon.unlock();
		}
	});
	
	debugIcon.selected.Connect(() => {
		DebugPanel.isOpenAtom(true);
	});
	
	debugIcon.deselected.Connect(() => {
		DebugPanel.isOpenAtom(false);
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
