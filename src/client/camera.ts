import { GuiService, RunService, Workspace } from '@rbxts/services';
import { createMotion } from '@rbxts/ripple';
import { peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/timeSpan';
import { Shake } from 'shared/shake';
import { CharacterState } from './character/state';
import { StartScreenState } from './ui/startScreenState';

export namespace Camera {
	export const instance = Workspace.WaitForChild('Camera') as Camera;
	
	export const cframeMotion = createMotion<CFrame>(CFrame.identity, {
		heartbeat: RunService.PreRender,
		start: true,
	});
}

function onCameraTypeChange(): void {
	Camera.instance.CameraType = Enum.CameraType.Scriptable;
}

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
		Camera.instance.FieldOfView = fieldOfView;
		
		if (GuiService.ReducedMotionEnabled) {
			Camera.instance.FieldOfView = math.min(Camera.instance.FieldOfView, 80);
		}
	} else {
		const isInStartScreen = peek(StartScreenState.isVisibleAtom);
		if (isInStartScreen) {
			Camera.instance.FieldOfView = 45;
		} else {
			Camera.instance.FieldOfView = 70;
		}
	}
	
	Camera.instance.CFrame = cameraCFrame;
});

onCameraTypeChange();
Camera.instance.GetPropertyChangedSignal('CameraType').Connect(onCameraTypeChange);
