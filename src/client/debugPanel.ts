import { RunService, Workspace } from '@rbxts/services';
import { atom, peek, subscribe } from '@rbxts/charm';
import Iris from '@rbxts/iris';

import { IsDebugPanelEnabled } from 'shared/constants';
import { TimeSpan } from 'shared/timeSpan';
import { CharacterState } from 'client/character/state';

export namespace DebugPanel {
	export const isOpenAtom = atom<boolean>(false);
	export const disableRagdollAtom = atom<boolean>(false);
	
	export function render(): void {
		Iris.Window(['Debug Panel', false, false, false, true], { position: windowPositionState, size: windowSizeState, isOpened: windowOpenedState }); {
			Iris.SliderNum(['Camera Z-Offset', 1, 0, 100], { number: cameraZOffsetState });
			Iris.SliderNum(['Max Hammer Distance', 1, 0, 100], { number: hammerDistanceState });
			Iris.Checkbox(['Disable Ragdoll'], { isChecked: disableRagdollState });
			Iris.Checkbox(['Map Boundaries'], { isChecked: mapBoundariesState });
			Iris.Checkbox(['Legacy Physics'], { isChecked: legacyPhysicsState });
			
			if (windowOpenedState.get()) {
				const timeStart = peek(CharacterState.timeStartAtom);
				const shakeStrength = peek(CharacterState.shakeStrengthAtom);
				const ragdollTimeEnd = peek(CharacterState.ragdollTimeEndAtom);
				const mousePosition = peek(CharacterState.mousePositionAtom);
				const thumbstickDirection = peek(CharacterState.thumbstickDirectionAtom);
				
				Iris.Text(['Time: %.3fs'.format(timeStart !== undefined ? TimeSpan.timeSince(timeStart) : 0)]);
				Iris.Text(['Shake Strength: %.4f'.format(shakeStrength)]);
				Iris.Text(['Ragdoll Duration: %.3fs'.format(ragdollTimeEnd !== undefined ? TimeSpan.timeUntil(ragdollTimeEnd) : 0)]);
				Iris.Text(['Mouse Position: (%d, %d)'.format(mousePosition?.X ?? -1, mousePosition?.Y ?? -1)]);
				Iris.Text(['Thumbstick Direction: (%.3f, %.3f)'.format(thumbstickDirection?.X ?? 0, thumbstickDirection?.Y ?? 0)]);
			}
		} Iris.End();
	}
}

const windowPositionState = Iris.State<Vector2>(Vector2.zero);
const windowSizeState = Iris.State<Vector2>(new Vector2(400, 250));
const windowOpenedState = Iris.State<boolean>(false);

const cameraZOffsetState = Iris.State<number>(peek(CharacterState.cameraZOffsetAtom));
cameraZOffsetState.onChange((cameraZOffset) => CharacterState.cameraZOffsetAtom(-cameraZOffset));

const hammerDistanceState = Iris.State<number>(peek(CharacterState.hammerDistanceAtom));
hammerDistanceState.onChange((hammerDistance) => CharacterState.hammerDistanceAtom(hammerDistance));

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
		
		const preRenderEvent = RunService.PreRender.Connect(() => {
			if (!mapBoundariesState.value) {
				boundariesPart.Destroy();
				preRenderEvent.Disconnect();
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

const legacyPhysicsState = Iris.State<boolean>(peek(CharacterState.useLegacyPhysicsAtom));
legacyPhysicsState.onChange((legacyPhysics) => CharacterState.useLegacyPhysicsAtom(legacyPhysics));

if (IsDebugPanelEnabled && RunService.IsRunning()) {
	Iris.Init();
	Iris.Connect(DebugPanel.render);
	
	subscribe(DebugPanel.isOpenAtom, (isOpen) => {
		windowOpenedState.set(isOpen);
	});
	
	subscribe(CharacterState.cameraZOffsetAtom, (cameraZOffset) => {
		cameraZOffsetState.set(-cameraZOffset);
	});
	
	subscribe(CharacterState.hammerDistanceAtom, (hammerDistance) => {
		hammerDistanceState.set(hammerDistance);
	});
	
	subscribe(CharacterState.useLegacyPhysicsAtom, (legacyPhysics) => {
		legacyPhysicsState.set(legacyPhysics);
	});
}
