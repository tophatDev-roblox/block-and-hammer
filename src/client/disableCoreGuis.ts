import { StarterGui } from '@rbxts/services';

import { setTimeout } from 'shared/timeout';

function disableCoreGuis(): void {
	try {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Captures, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.EmotesMenu, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.SelfView, false);
	} catch (err) {
		setTimeout(disableCoreGuis, 1);
	}
}

disableCoreGuis();
