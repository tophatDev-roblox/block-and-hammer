import { RunService } from '@rbxts/services';
import React, { useBinding, useMemo } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';
import { peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/timeSpan';
import { Shake } from 'shared/shake';
import { Units } from 'shared/units';
import { Styles } from 'client/styles';
import { CharacterState } from 'client/character/state';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const [text, setText] = useBinding<string>('--');
	const [rotation, setRotation] = useBinding<number>(0);
	
	const characterParts = useAtom(CharacterState.partsAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const labelFormat = useMemo(() => `%.${styles.hud.text.speedometer.display.decimals}fm/s`, [styles.hud.text.speedometer.display.decimals]);
	
	useEventListener(RunService.PreSimulation, () => {
		const time = TimeSpan.now();
		if (characterParts === undefined) {
			setText('--');
			setRotation(0);
			return;
		}
		
		const speed = Units.studsToMeters(characterParts.body.AssemblyLinearVelocity.Magnitude);
		setText(labelFormat.format(speed));
		setRotation(Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 3));
	});
	
	return (
		<frame
			key={'Speedometer'}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
			LayoutOrder={1}
		>
			<Text
				styles={styles.hud.text.speedometer}
				text={text}
				automaticWidth
				automaticHeight
				properties={{
					Rotation: rotation,
				}}
			/>
		</frame>
	);
};

export default Speedometer;
