import { atom } from '@rbxts/charm';

export namespace UI {
	export const stateAtom = atom<State>(State.StartScreen);
	
	export const enum DisplayOrder {
		StartScreen = 0,
		HUD = 1,
		SideMenu = 2,
		Version = 3,
		Transition = 50,
	}
	
	export const enum State {
		StartScreen,
		Game,
		SideMenu,
	}
	
	export namespace SideMenu {
		export const panelAtom = atom<Panel>(Panel.None);
		export const isClosingPanelAtom = atom<boolean>(false);
		
		export const enum Panel {
			None,
			Settings,
		}
	}
}
