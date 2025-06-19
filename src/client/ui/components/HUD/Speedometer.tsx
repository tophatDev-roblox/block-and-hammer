import React, { useEffect, useRef } from '@rbxts/react';

import { useGameContext } from 'client/ui/gameProvider/context';
import { useStepped } from 'client/ui/hooks/useStepped';
import Units from 'shared/units';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const { styles, body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudSecondary.decimals}fm/s`;
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
	}, [body, styles.text.hudSecondary.decimals]);
	
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
