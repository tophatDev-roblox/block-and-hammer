import { RunService } from '@rbxts/services';

import React, { useBinding } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';

import { peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/time-span';
import { Shake } from 'shared/shake';
import { Units } from 'shared/units';

import { Styles } from 'client/styles';

import { CharacterState } from 'client/character/state';

import Text from '../Text';

interface AltitudeProps {
	bodyRef: React.RefObject<Part>;
}

const Speedometer: React.FC<AltitudeProps> = ({ bodyRef }) => {
	const [text, setText] = useBinding<string>('--');
	const [rotation, setRotation] = useBinding<number>(0);
	
	useEventListener(RunService.PreRender, () => {
		const time = TimeSpan.now();
		
		const shakeStrength = peek(CharacterState.shakeStrengthAtom);
		setRotation(Shake.ui(shakeStrength, time, 1));
		
		const body = bodyRef.current;
		if (body === undefined) {
			setText('--');
			return;
		}
		
		setText('%.1fm/s'.format(Units.studsToMeters(body.AssemblyLinearVelocity.Magnitude)));
	});
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
		>
			<Text
				styles={Styles.UI.hud.speedometer}
				text={text}
				alignX={Enum.TextXAlignment.Center}
				autoHeight
				overrides={{
					Rotation: rotation,
				}}
			/>
		</frame>
	);
};

export default Speedometer;
