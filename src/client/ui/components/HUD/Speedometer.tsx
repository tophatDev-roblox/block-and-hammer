import React, { useEffect, useRef } from '@rbxts/react';

import { useStylesContext } from 'client/ui/providers/styles';
import { useGameContext } from 'client/ui/providers/game';
import { useStepped } from 'client/ui/hooks/useStepped';
import Units from 'shared/units';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const { styles } = useStylesContext();
	const { body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudSecondary.display.decimals}fm/s`;
		const label = labelRef.current;
		if (label === undefined || body === undefined) {
			return;
		}
		
		const disconnectSteppedEvent = useStepped(() => {
			const speed = Units.studsToMeters(body.AssemblyLinearVelocity.Magnitude);
			label.Text = labelFormat.format(speed);
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [body, styles.text.hudSecondary.display.decimals]);
	
	return (
		<Text
			ref={labelRef}
			styles={styles.text.hudSecondary}
			text={'--'}
			order={1}
			automaticHeight
		/>
	);
};

export default Speedometer;
