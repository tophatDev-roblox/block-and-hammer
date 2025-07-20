import { RunService, Workspace } from '@rbxts/services';

import Iris from '@rbxts/iris';

import { peek, subscribe } from '@rbxts/charm';

import { Constants } from 'shared/constants';
import { TimeSpan } from 'shared/time-span';

import { CharacterState } from 'client/character/state';
import { StatusEffect } from 'client/status-effect';

import { DebugPanelState } from './state';
import { LocationState } from 'client/ui/location-state';

export namespace DebugPanel {
	export function render(): void {
		Iris.Window(['Debug Panel', false, false, false, true], { position: windowPositionState, size: windowSizeState, isOpened: windowOpenedState }); {
			Iris.CollapsingHeader(['Camera']); {
				Iris.SliderNum(['Z-Offset', 1, 0, 100], { number: cameraZOffsetState });
			} Iris.End();
			
			Iris.CollapsingHeader(['Character']); {
				Iris.Checkbox(['Disable Ragdoll'], { isChecked: disableRagdollState });
				Iris.Checkbox(['Map Boundaries'], { isChecked: mapBoundariesState });
				Iris.Checkbox(['Legacy Physics'], { isChecked: legacyPhysicsState });
			} Iris.End();
			
			Iris.CollapsingHeader(['Hammer']); {
				Iris.SliderNum(['Max Hammer Distance', 1, 0, 100], { number: hammerDistanceState });
			} Iris.End();
			
			if (windowOpenedState.get()) {
				Iris.CollapsingHeader(['Info']); {
					const timeStart = peek(CharacterState.timeStartAtom);
					const shakeStrength = peek(CharacterState.shakeStrengthAtom);
					const path = peek(LocationState.pathAtom);
					
					Iris.Text(['Time: %.3fs'.format(timeStart !== undefined ? TimeSpan.timeSince(timeStart) : 0)]);
					Iris.Text(['Shake Strength: %.4f'.format(shakeStrength)]);
					Iris.Text(['UI Path: %s'.format(path)]);
				} Iris.End();
				
				Iris.CollapsingHeader(['Input']); {
					const mousePosition = peek(CharacterState.mousePositionAtom);
					const thumbstickDirection = peek(CharacterState.thumbstickDirectionAtom);
					
					Iris.Text(['Mouse Position: (%d, %d)'.format(mousePosition?.X ?? -1, mousePosition?.Y ?? -1)]);
					Iris.Text(['Thumbstick Direction: (%.3f, %.3f)'.format(thumbstickDirection?.X ?? 0, thumbstickDirection?.Y ?? 0)]);
				} Iris.End();
				
				Iris.CollapsingHeader(['Status Effects']); {
					const effectIndexState = Iris.State<StatusEffect>(StatusEffect.Dizzy);
					const effectDurationState = Iris.State<number>(1);
					
					const effectSelection = [StatusEffect.Dizzy, StatusEffect.Ragdoll];
					const statusEffects = peek(CharacterState.statusEffectsAtom);
					
					Iris.Text(['Currently Active: %s'.format(
						statusEffects.size() > 0 ? statusEffects.map((statusEffect) => statusEffect.effect).join(', ') : 'None',
					)]);
					Iris.ComboArray(['Effect'], { index: effectIndexState }, effectSelection);
					Iris.SliderNum(['Duration', 0.1, 0.1, 15], { number: effectDurationState });
					
					const applyButton = Iris.Button(['Apply']);
					if (applyButton.clicked()) {
						const effect = effectIndexState.get();
						const duration = effectDurationState.get();
						
						CharacterState.applyStatusEffects([
							[effect, duration],
						]);
					}
				} Iris.End();
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
disableRagdollState.onChange((disableRagdoll) => DebugPanelState.disableRagdollAtom(disableRagdoll));

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

if (Constants.IsDebugPanelEnabled && RunService.IsRunning()) {
	Iris.Init();
	Iris.Connect(DebugPanel.render);
	
	subscribe(DebugPanelState.isOpenAtom, (isOpen) => {
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
