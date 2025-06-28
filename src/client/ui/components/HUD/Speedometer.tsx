import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { peek } from '@rbxts/charm';

import { Shake } from 'shared/shake';
import { Units } from 'shared/units';
import { useStepped } from 'client/ui/hooks/useStepped';
import { stylesAtom } from 'client/ui/styles';
import { shakeStrengthAtom, characterAtom } from 'client/character/atoms';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const labelRef = useRef<TextLabel>();
	
	const character = useAtom(characterAtom);
	const styles = useAtom(stylesAtom);
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudSecondary.display.decimals}fm/s`;
		const label = labelRef.current;
		if (label === undefined || character === undefined) {
			return;
		}
		
		const disconnectSteppedEvent = useStepped((_, time) => {
			const speed = Units.studsToMeters(character.body.AssemblyLinearVelocity.Magnitude);
			label.Text = labelFormat.format(speed);
			label.Rotation = Shake.ui(peek(shakeStrengthAtom), time, 3);
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [character, styles.text.hudSecondary.display.decimals]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
		>
			<Text
				ref={labelRef}
				styles={styles.text.hudSecondary}
				text={'--'}
				order={1}
				automaticWidth
				automaticHeight
			/>
		</frame>
	);
};

export default Speedometer;
