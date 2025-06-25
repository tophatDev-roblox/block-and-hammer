import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import Units from 'shared/units';
import { useGameContext } from 'client/ui/providers/game';
import { useStepped } from 'client/ui/hooks/useStepped';
import { stylesAtom } from 'client/ui/styles';
import Text from '../Text';

const Altitude: React.FC = () => {
	const { body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	const styles = useAtom(stylesAtom);
	
	useEffect(() => {
		const labelFormat = `%.${styles.text.hudPrimary.display.decimals}fm`;
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
	}, [body, styles.text.hudPrimary.display.decimals]);
	
	return (
		<Text
			ref={labelRef}
			styles={styles.text.hudPrimary}
			text={'--'}
			order={2}
			automaticHeight
		/>
	);
};

export default Altitude;
