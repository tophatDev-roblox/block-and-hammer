import React, { useEffect, useRef } from '@rbxts/react';

import { useGameContext } from 'client/ui/gameProvider/context';
import { useStepped } from 'client/ui/hooks/useStepped';
import Units from 'shared/units';
import Text from '../Text';

const Altitude: React.FC = () => {
	const { styles, body } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	const labelFormat = '%.1fm';
	
	useEffect(() => {
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
	}, [body]);
	
	return (
		<Text
			ref={labelRef}
			styles={styles.text.hudPrimary}
			text={'--'}
			automaticHeight
		/>
	);
	// return (
	// 	<textlabel
	// 		ref={labelRef}
	// 		BackgroundTransparency={1}
	// 		FontFace={new Font('rbxassetid://12187365364', Enum.FontWeight.Heavy, Enum.FontStyle.Normal)}
	// 		Text={'--'}
	// 		TextColor3={Color3.fromRGB(255, 255, 255)}
	// 		TextSize={40}
	// 		LayoutOrder={1}
	// 		Size={new UDim2(1, 0, 0, 0)}
	// 		AutomaticSize={Enum.AutomaticSize.Y}
	// 	>
	// 		<uistroke>
	// 			<uigradient
	// 				Rotation={-90}
	// 				Transparency={new NumberSequence(0, 0.7)}
	// 			/>
	// 		</uistroke>
	// 	</textlabel>
	// );
};

export default Altitude;
