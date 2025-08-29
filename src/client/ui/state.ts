import { atom, batch, peek } from '@rbxts/charm';

import { Accessories } from 'shared/accessories';

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
		export const categoryAtom = atom<Accessories.Category>(Accessories.Category.Hats);
		export const accessoryAtom = atom<Accessories.BaseAccessory>();
		export const accessoryUidAtom = atom<string>();
		export const boughtAccessoriesAtom = atom<Set<string>>(new Set());
		export const temporaryAccessoriesAtom = atom<Accessories.EquippedAccessories>();
		
		export const enum Tab {
			Accessories,
			Colors,
		}
		
		export function selectAccessoryAtom(accessory: Accessories.BaseAccessory, uid: string): void {
			batch(() => {
				accessoryAtom(accessory);
				accessoryUidAtom(uid);
			});
		}
		
		export function unselectAccessoryAtom(): void {
			batch(() => {
				accessoryAtom(undefined);
				accessoryUidAtom(undefined);
			});
		}
	}
}
