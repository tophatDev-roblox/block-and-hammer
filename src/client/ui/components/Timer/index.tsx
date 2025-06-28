import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Shake } from 'shared/shake';
import { TimeSpan } from 'shared/timeSpan';
import { useStepped } from 'client/ui/hooks/useStepped';
import { usePx } from 'client/ui/hooks/usePx';
import { Styles } from 'client/styles';
import { CharacterState } from 'client/character/state';
import Text from '../Text';
import { peek } from '@rbxts/charm';
import { RichText } from 'shared/richText';

const Timer: React.FC = () => {
	const labelRef = useRef<TextLabel>();
	
	const character = useAtom(CharacterState.partsAtom);
	const styles = useAtom(Styles.stateAtom);
	const px = usePx();
	
	useEffect(() => {
		const label = labelRef.current;
		if (label === undefined || character === undefined) {
			return;
		}
		
		const millisecondsRichText = new RichText({ font: { size: px(styles.text.timer.display.millisecondsFontSize) } });
		
		const disconnectSteppedEvent = useStepped((_, time) => {
			const currentTime = TimeSpan.now();
			const startTime = character.model.GetAttribute('startTime') ?? currentTime;
			if (!typeIs(startTime, 'number')) {
				warn('[client::ui/Timer] character attribute "startTime" is not a number');
				return;
			}
			
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
			label.Text = `${timeString}.${millisecondsRichText.apply(millisecondsString)}`;
			label.Rotation = Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 1);
		});
		
		return () => {
			disconnectSteppedEvent();
			label.Text = '--';
		};
	}, [character, styles, px]);
	
	return (
		<screengui
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<uipadding
				PaddingTop={new UDim(0, 8)}
				PaddingRight={new UDim(0, 12)}
				PaddingBottom={new UDim(0, 8)}
				PaddingLeft={new UDim(0, 12)}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
			/>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
			>
				<Text
					ref={labelRef}
					styles={styles.text.timer}
					text={'--'}
					alignX={Enum.TextXAlignment.Left}
					automaticHeight
					automaticWidth
					richText
				/>
			</frame>
		</screengui>
	);
};

export default Timer;
