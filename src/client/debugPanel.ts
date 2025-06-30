import { RunService, Workspace } from '@rbxts/services';
import { atom, peek, subscribe } from '@rbxts/charm';
import Iris from '@rbxts/iris';

import { IsDebugPanelEnabled } from 'shared/constants';
import { CharacterState } from 'client/character/state';

export namespace DebugPanel {
	export const isOpenAtom = atom<boolean>(false);
	export const disableRagdollAtom = atom<boolean>(false);
	
	export function render(): void {
		Iris.Window(['Debug Panel', false, false, false, true], { position: windowPositionState, size: windowSizeState, isOpened: windowOpenedState }); {
			Iris.SliderNum(['Camera Z-Offset', 1, 0, 100], { number: cameraZOffsetState });
			Iris.Checkbox(['Disable Ragdoll'], { isChecked: disableRagdollState });
			Iris.Checkbox(['Map Boundaries'], { isChecked: mapBoundariesState });
		} Iris.End();
	}
}

const windowPositionState = Iris.State<Vector2>(Vector2.zero);
const windowSizeState = Iris.State<Vector2>(new Vector2(400, 250));
const windowOpenedState = Iris.State<boolean>(false);

const cameraZOffsetState = Iris.State<number>(peek(CharacterState.cameraZOffsetAtom));
cameraZOffsetState.onChange((cameraZOffset) => CharacterState.cameraZOffsetAtom(-cameraZOffset));

const disableRagdollState = Iris.State<boolean>(false);
disableRagdollState.onChange((disableRagdoll) => DebugPanel.disableRagdollAtom(disableRagdoll));

const mapBoundariesState = Iris.State<boolean>(false);
mapBoundariesState.onChange((mapBoundaries) => {
	if (mapBoundaries) {
		const boundariesPart = new Instance('Part');
		boundariesPart.Name = 'MapBoundaries';
		boundariesPart.Anchored = true;
		boundariesPart.CanCollide = false;
		boundariesPart.CastShadow = false;
		boundariesPart.Size = new Vector3(512, 512, 4);
		boundariesPart.Color = Color3.fromRGB(255, 255, 255);
		boundariesPart.Material = Enum.Material.ForceField;
		boundariesPart.Parent = Workspace;
		
		const renderSteppedEvent = RunService.RenderStepped.Connect(() => {
			if (!mapBoundariesState.value) {
				boundariesPart.Destroy();
				renderSteppedEvent.Disconnect();
				return;
			}
			
			const characterParts = peek(CharacterState.partsAtom);
			if (characterParts === undefined) {
				return;
			}
			
			boundariesPart.Position = characterParts.body.Position;
		});
	}
});

if (IsDebugPanelEnabled && RunService.IsRunning()) {
	Iris.Init();
	Iris.Connect(DebugPanel.render);
	
	subscribe(DebugPanel.isOpenAtom, (isOpen) => {
		windowOpenedState.set(isOpen);
	});
	
	subscribe(CharacterState.cameraZOffsetAtom, (cameraZOffset) => {
		cameraZOffsetState.set(-cameraZOffset);
	});
}
