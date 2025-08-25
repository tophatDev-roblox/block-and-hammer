import { atom, peek } from '@rbxts/charm';

import { TransitionState } from './transition-state';

export namespace UI {
	export const stateAtom = atom<State>(State.StartScreen);
	
	export const enum DisplayOrder {
		StartScreen = 0,
		HUD = 1,
		SideMenu = 2,
		Inventory = 3,
		Version = 4,
		Transition = 50,
	}
	
	export const enum State {
		StartScreen,
		Game,
		SideMenu,
		Inventory,
	}
	
	export namespace SideMenu {
		export const panelAtom = atom<Panel>(Panel.None);
		export const isClosingPanelAtom = atom<boolean>(false);
		
		export function canToggle(state: State = peek(stateAtom), isTransitioning: boolean = peek(TransitionState.isTransitioningAtom)): boolean {
			return (state === State.SideMenu || state === State.Game) && !isTransitioning;
		}
		
		export const enum Panel {
			None,
			Settings,
		}
	}
	
	export namespace Inventory {
		export const tabAtom = atom<Tab>(Tab.Accessories);
		
		export const enum Tab {
			Accessories,
			Customization,
		}
	}
}
