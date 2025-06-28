import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { peek } from '@rbxts/charm';

import { Shake } from 'shared/shake';
import { Units } from 'shared/units';
import { useStepped } from 'client/ui/hooks/useStepped';
import { stylesAtom } from 'client/ui/styles';
import { CharacterState } from 'client/character/state';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const labelRef = useRef<TextLabel>();
	
	const characterParts = useAtom(CharacterState.partsAtom);
	const styles = useAtom(stylesAtom);
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudSecondary.display.decimals}fm/s`;
		const label = labelRef.current;
		if (label === undefined || characterParts === undefined) {
			return;
		}
		
		const disconnectSteppedEvent = useStepped((_, time) => {
			const speed = Units.studsToMeters(characterParts.body.AssemblyLinearVelocity.Magnitude);
			label.Text = labelFormat.format(speed);
			label.Rotation = Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 3);
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [characterParts, styles.text.hudSecondary.display.decimals]);
	
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
