import { atom } from '@rbxts/charm';

export namespace DebugPanelState {
	export const isOpenAtom = atom<boolean>(false);
	export const disableRagdollAtom = atom<boolean>(false);
}
