import { StarterGui } from '@rbxts/services';

while (true) {
	try {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Captures, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.EmotesMenu, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.SelfView, false);
		break;
	} catch (err) {
		task.wait(1);
	}
}
