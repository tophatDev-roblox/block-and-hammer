import { Players, RunService } from '@rbxts/services';

import { effect, peek, subscribe } from '@rbxts/charm';

import NumberSpinner from 'shared/NumberSpinner';
import Icon from 'shared/Icon';

import { UserSettings } from 'shared/user-settings';
import { Constants } from 'shared/constants';
import { InputType } from 'shared/input-type';
import { TimeSpan } from 'shared/time-span';
import { RichText } from 'shared/rich-text';

import { clientInputTypeAtom } from 'client/input';

import { Styles } from 'client/styles';

import { TransitionState } from 'client/ui/transition-state';
import { ModalState } from 'client/ui/modal-state';
import { UI } from 'client/ui/state';

import { DebugPanelState } from 'client/debug-panel/state';
import { ClientSettings } from 'client/client-settings';

const client = Players.LocalPlayer;

const dollarsNumber = new NumberSpinner();
dollarsNumber.Value = 0;
dollarsNumber.Decimals = 0;
dollarsNumber.Commas = true;

const monospaceRichText = new RichText({ font: { family: 'rbxassetid://16658246179' } })

let lastPerformanceUpdate = -1;

const mainTheme = [
	['IconImageScale', 'Value', 0.8],
	['IconButton', 'BackgroundTransparency', 0.4],
	['IconSpot', 'BackgroundColor3', Color3.fromRGB(0, 0, 0), 'Selected'],
	['IconSpot', 'BackgroundTransparency', 0.6, 'Selected'],
];

const secondaryTheme = [
	['IconLabel', 'TextSize', 26],
	['IconLabel', 'FontFace', new Font('rbxassetid://12187365364', Enum.FontWeight.ExtraBold, Enum.FontStyle.Normal)],
	['IconButton', 'BackgroundTransparency', 0.6],
];

Icon.setDisplayOrder(100);

const menuIcon = new Icon()
	.setImage(79239443855874)
	.setCaption('Toggle menu')
	.bindToggleKey(Enum.KeyCode.ButtonB)
	.bindToggleKey(Enum.KeyCode.B)
	.setOrder(0)
	.autoDeselect(false)
	.modifyTheme(mainTheme);

new Icon()
	.convertLabelToNumberSpinner(dollarsNumber)
	.setOrder(10)
	.lock()
	.modifyTheme(secondaryTheme)
	.modifyTheme([
		['PaddingLeft', 'Size', new UDim2(0, 24, 1, 0)],
		['PaddingRight', 'Size', new UDim2(0, 24, 1, 0)],
	]);

const fpsIcon = new Icon()
	.setLabel('-- FPS')
	.setOrder(11)
	.lock()
	.modifyTheme(secondaryTheme);

const pingIcon = new Icon()
	.setLabel('--ms Ping')
	.setOrder(12)
	.lock()
	.modifyTheme(secondaryTheme);

menuIcon.toggled.Connect((toggled) => {
	const state = peek(UI.stateAtom);
	
	if (state === UI.State.StartScreen || peek(TransitionState.isTransitioningAtom)) {
		return;
	}
	
	if (toggled) {
		UI.stateAtom(UI.State.SideMenu);
	} else {
		UI.stateAtom(UI.State.Game);
	}
});

effect(() => {
	const state = UI.stateAtom();
	
	if (state === UI.State.StartScreen) {
		menuIcon.lock();
		Icon.setTopbarEnabled(false);
	} else {
		menuIcon.unlock();
		Icon.setTopbarEnabled(true);
	}
	
	if (state === UI.State.SideMenu) {
		menuIcon.select();
	} else {
		menuIcon.deselect();
	}
});

effect(() => {
	const modal = ModalState.stateAtom();
	
	if (modal !== undefined) {
		menuIcon.lock();
	} else {
		menuIcon.unlock();
	}
});

effect(() => {
	const inputType = clientInputTypeAtom();
	
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

if (Constants.IsDebugPanelEnabled) {
	const debugIcon = new Icon()
		.setImage(6953984446)
		.setCaption('Open debug panel')
		.bindToggleKey(Enum.KeyCode.Quote)
		.setOrder(9)
		.autoDeselect(false)
		.modifyTheme(mainTheme)
		.modifyTheme(['IconImageScale', 'Value', 0.7]);
	
	subscribe(DebugPanelState.isOpenAtom, (isOpen) => {
		if (isOpen) {
			debugIcon.select();
		} else {
			debugIcon.deselect();
		}
	});
	
	debugIcon.selected.Connect(() => {
		DebugPanelState.isOpenAtom(true);
	});
	
	debugIcon.deselected.Connect(() => {
		DebugPanelState.isOpenAtom(false);
	});
}

function applyStyles(_styles: Styles.Topbar): void {
	// TODO: apply ui styles to topbar
}

function onAttributeChanged(attribute: string) {
	if (attribute === 'dollars') {
		dollarsNumber.Value = math.clamp(tonumber(client.GetAttribute(attribute)) ?? 0, Constants.MinDollars, Constants.MaxDollars);
	}
}

function onPreRender(dt: number) {
	if (TimeSpan.timeSince(lastPerformanceUpdate) < 0.2) {
		return;
	}
	
	const userSettings = peek(ClientSettings.stateAtom);
	
	const performanceDisplay = userSettings.ui.topbar.performanceDisplay;
	
	if (performanceDisplay === UserSettings.PerformanceDisplay.Off) {
		return;
	}
	
	lastPerformanceUpdate = TimeSpan.now();
	
	const fps = monospaceRichText.apply(tostring(math.round(1 / dt)));
	const ping = monospaceRichText.apply(`${math.round(client.GetNetworkPing() * 1000)}ms`);
	
	if (performanceDisplay === UserSettings.PerformanceDisplay.WithLabels) {
		fpsIcon.setLabel('%s FPS'.format(fps));
		pingIcon.setLabel('%s Ping'.format(ping));
	} else {
		fpsIcon.setLabel(fps);
		pingIcon.setLabel(ping);
	}
}

effect(() => {
	const userSettings = ClientSettings.stateAtom();
	
	const enabled = userSettings.ui.topbar.performanceDisplay !== UserSettings.PerformanceDisplay.Off;
	
	fpsIcon.setEnabled(enabled);
	pingIcon.setEnabled(enabled);
});

applyStyles(Styles.Topbar);
onAttributeChanged('dollars');

client.AttributeChanged.Connect(onAttributeChanged);
RunService.PreRender.Connect(onPreRender);
