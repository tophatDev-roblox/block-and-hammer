import { atom, subscribe } from '@rbxts/charm';
import Iris from '@rbxts/iris';

import { IsDebugPanelEnabled } from 'shared/constants';
import { cameraZOffsetAtom } from 'client/character/atoms';

export const isDebugPanelOpenAtom = atom<boolean>(false);
export const debugDisableRagdollAtom = atom<boolean>(false);

const windowPositionState = Iris.State<Vector2>(Vector2.zero);
const windowSizeState = Iris.State<Vector2>(new Vector2(400, 250));
const windowOpenedState = Iris.State<boolean>(false);

const cameraZOffsetState = Iris.State<number>(30);
cameraZOffsetState.onChange((cameraZOffset) => cameraZOffsetAtom(-cameraZOffset));

const disableRagdollState = Iris.State<boolean>(false);
disableRagdollState.onChange((disableRagdoll) => debugDisableRagdollAtom(disableRagdoll));

export function render(): void {
	Iris.Window(['Debug Panel', false, false, false, true], { position: windowPositionState, size: windowSizeState, isOpened: windowOpenedState }); {
		Iris.SliderNum(['Camera Z-Offset', 1, 0, 100], { number: cameraZOffsetState });
		Iris.Checkbox(['Disable Ragdoll'], { isChecked: disableRagdollState });
	} Iris.End();
}

if (IsDebugPanelEnabled) {
	Iris.Init();
	Iris.Connect(render);
	
	subscribe(isDebugPanelOpenAtom, (isDebugPanelOpen) => {
		windowOpenedState.set(isDebugPanelOpen);
	});
	
	subscribe(cameraZOffsetAtom, (cameraZOffset) => {
		cameraZOffsetState.set(-cameraZOffset);
	});
}
