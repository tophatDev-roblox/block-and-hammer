import React, { useEffect, useRef } from '@rbxts/react';

import { useGameContext } from 'client/ui/gameProvider/context';
import { useStepped } from 'client/ui/hooks/useStepped';
import Units from 'shared/units';
import Text from '../Text';

const Altitude: React.FC = () => {
	const { styles, body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudPrimary.decimals}fm`;
		const label = labelRef.current;
		if (label === undefined || body === undefined) {
			return;
		}
		
		const disconnectSteppedEvent = useStepped(() => {
			const altitude = Units.studsToMeters(math.max(body.Position.Y - body.Size.Y / 2, 0));
			label.Text = labelFormat.format(altitude);
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [body, styles.text.hudPrimary.decimals]);
	
	return (
		<Text
			ref={labelRef}
			styles={styles.text.hudPrimary}
			text={'--'}
			automaticHeight
		/>
	);
};

export default Altitude;
