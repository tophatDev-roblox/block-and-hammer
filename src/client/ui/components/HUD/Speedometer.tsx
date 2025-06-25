import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import Units from 'shared/units';
import { useGameContext } from 'client/ui/providers/game';
import { useStepped } from 'client/ui/hooks/useStepped';
import { stylesAtom } from 'client/ui/styles';
import Text from '../Text';

const Speedometer: React.FC = () => {
	const { body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	const styles = useAtom(stylesAtom);
	
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
