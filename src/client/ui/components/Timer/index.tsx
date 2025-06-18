import React, { useEffect, useRef } from '@rbxts/react';

import { useGameContext } from 'client/ui/gameProvider/context';
import Text from '../Text';
import { useStepped } from 'client/ui/hooks/useStepped';

const Timer: React.FC = () => {
	const { styles, cube } = useGameContext();
	
	const labelRef = useRef<TextLabel>();
	
	useEffect(() => {
		const label = labelRef.current;
		if (label === undefined || cube === undefined) {
			return;
		}
		
		const disconnectSteppedEvent = useStepped(() => {
			const currentTime = os.clock();
			const startTime = tonumber(cube.GetAttribute('startTime')) ?? currentTime;
			const elapsedTime = currentTime - startTime;
			
			const seconds = math.floor(elapsedTime) % 60;
			const minutes = elapsedTime.idiv(60) % 60;
			const hours = elapsedTime.idiv(3600);
			
			let timeString = tostring(seconds);
			if (hours > 0) {
				timeString = string.format('%d:%02d:%02d', hours, minutes, seconds);
			} else if (minutes > 0) {
				timeString = string.format('%d:%02d', minutes, seconds);
			}
			
			const millisecondsString = string.format('%02d', math.floor(elapsedTime % 1 * 100));
			label.Text = `${timeString}.<font size="${styles.text.timerMillisecondsFontSize}">${millisecondsString}</font>`;
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [cube]);
	
	return (
		<screengui
			ResetOnSpawn={false}
		>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 1)}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
			>
				<uipadding
					PaddingBottom={new UDim(0, 8)}
					PaddingLeft={new UDim(0, 12)}
				/>
				<Text
					ref={labelRef}
					styles={styles.text.timer}
					text={'--'}
					alignX={Enum.TextXAlignment.Left}
					automaticHeight
					richText
				/>
			</frame>
		</screengui>
	);
};

export default Timer;
