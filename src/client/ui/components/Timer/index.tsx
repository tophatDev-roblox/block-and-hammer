import { RunService } from '@rbxts/services';

import React, { useBinding, useMemo } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/time-span';
import { RichText } from 'shared/rich-text';
import { Styles } from 'shared/styles';
import { Shake } from 'shared/shake';

import { CharacterState } from 'client/character/state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Text from '../Text';

const TimerGUI: React.FC = () => {
	const [text, setText] = useBinding<string>('--');
	const [rotation, setRotation] = useBinding<number>(0);
	
	const timeStart = useAtom(CharacterState.timeStartAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	const millisecondsRichText = useMemo(() => {
		if (styles.timer.text.display.milliseconds.autoScale === false) {
			return new RichText({
				font: {
					size: styles.timer.text.display.milliseconds.fontSize,
				},
			});
		}
		
		return new RichText({
			font: {
				size: px(styles.timer.text.display.milliseconds.fontSize),
			},
		});
	}, [styles.timer.text.display.milliseconds.fontSize, styles.timer.text.display.milliseconds.autoScale]);
	
	useEventListener(RunService.PreSimulation, () => {
		const time = TimeSpan.now();
		if (timeStart === undefined) {
			setText(`0.${millisecondsRichText.apply('00')}`);
			return;
		}
		
		const currentTime = TimeSpan.now();
		const elapsedTime = currentTime - timeStart;
		
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
		setText(`${timeString}.${millisecondsRichText.apply(millisecondsString)}`);
		setRotation(Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 1));
	});
	
	return (
		<screengui
			key={'TimerGUI'}
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<UIListLayout
				fillDirection={Enum.FillDirection.Horizontal}
				alignX={Enum.HorizontalAlignment.Left}
				alignY={Enum.VerticalAlignment.Bottom}
			/>
			<UIPadding
				padding={[px(8), px(12)]}
			/>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				LayoutOrder={0}
			>
				<Text
					styles={styles.timer.text}
					text={text}
					alignX={Enum.TextXAlignment.Left}
					automaticHeight
					automaticWidth
					richText
					properties={{
						Rotation: rotation,
					}}
				/>
			</frame>
		</screengui>
	);
};

export default TimerGUI;
