import { GuiService, RunService, Workspace } from '@rbxts/services';

import { createMotion } from '@rbxts/ripple';
import { atom, peek } from '@rbxts/charm';

import { waitForChild } from 'shared/wait-for-child';
import { TimeSpan } from 'shared/time-span';
import { Shake } from 'shared/shake';

import { CharacterState } from 'client/character/state';

import { UI } from 'client/ui/state';
import { debounce } from '@rbxts/set-timeout';

export namespace Camera {
	export const instanceAtom = atom<Camera>();
	export const viewportSizeAtom = atom<Vector2>(Vector2.one);
	
	export const cframeMotion = createMotion<CFrame>(CFrame.identity, {
		heartbeat: RunService.PreRender,
		start: true,
	});
}

function onCameraTypeChange(): void {
	const camera = peek(Camera.instanceAtom);
	if (camera === undefined) {
		return;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
}

const debouncedViewportSizeAtom = debounce((camera: Camera) => {
	Camera.viewportSizeAtom(camera.ViewportSize);
}, 0.2);

function onViewportSizeChange(): void {
	const camera = peek(Camera.instanceAtom);
	if (camera === undefined) {
		return;
	}
	
	debouncedViewportSizeAtom(camera);
}

(async () => {
	const camera = Workspace.CurrentCamera ?? await waitForChild(Workspace, 'Camera', 'Camera');
	Camera.instanceAtom(camera);
	
	onCameraTypeChange();
	onViewportSizeChange();
	
	camera.GetPropertyChangedSignal('CameraType').Connect(onCameraTypeChange);
	camera.GetPropertyChangedSignal('ViewportSize').Connect(onViewportSizeChange);
	
	Camera.cframeMotion.onStep((cameraCFrame, dt) => {
		const disableCamera = peek(CharacterState.disableCameraAtom);
		const characterParts = peek(CharacterState.partsAtom);
		if (!disableCamera && characterParts !== undefined) {
			const currentTime = TimeSpan.now();
			const shakeStrength = peek(CharacterState.shakeStrengthAtom);
			if (shakeStrength > 0) {
				const shakeCFrame = Shake.camera(shakeStrength, currentTime, false);
				cameraCFrame = cameraCFrame.mul(shakeCFrame);
				
				CharacterState.shakeStrengthAtom(math.max(shakeStrength - dt * 1.5, 0));
			}
			
			const velocity = characterParts.body.AssemblyLinearVelocity.Magnitude;
			if (velocity > 300) {
				const windStrength = math.min((velocity - 250) / 50, 6)
				const windCFrame = Shake.camera(windStrength, currentTime, true, 2);
				cameraCFrame = cameraCFrame.mul(windCFrame);
			}
			
			const fieldOfView = 70 + math.max(velocity - 120, 0) / 5;
			camera.FieldOfView = fieldOfView;
			
			if (GuiService.ReducedMotionEnabled) {
				camera.FieldOfView = math.min(camera.FieldOfView, 80);
			}
		} else {
			if (peek(UI.stateAtom) === UI.State.StartScreen) {
				camera.FieldOfView = 45;
			} else {
				camera.FieldOfView = 70;
			}
		}
		
		camera.CFrame = cameraCFrame;
	});
})();
