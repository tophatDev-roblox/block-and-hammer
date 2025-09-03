import { RunService } from '@rbxts/services';

import React, { useBinding, useEffect, useMemo, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';

import { effect, peek } from '@rbxts/charm';

import { TimeSpan } from 'shared/time-span';
import { RichText } from 'shared/rich-text';
import { Shake } from 'shared/shake';

import { CharacterState } from 'client/character/state';

import { usePx } from 'client/ui/hooks/use-px';

import { Styles } from 'client/styles';

import Text from '../Text';

const Timer: React.FC = () => {
	const [isStarted, setStarted] = useState<boolean>(false);
	
	const px = usePx();
	
	const millisecondsRichText = useMemo(() => new RichText({ font: { size: px(math.round(Styles.UI.hud.timer.size * 0.7)) } }), [px]);
	const defaultText = useMemo(() => `0.${millisecondsRichText.apply('00')}`, [millisecondsRichText]);
	
	const [text, setText] = useBinding<string>(defaultText);
	const [rotation, setRotation] = useBinding<number>(0);
	
	useEffect(() => {
		return effect(() => {
			const timeStart = CharacterState.timeStartAtom();
			
			setStarted(timeStart !== undefined);
		});
	}, []);
	
	useEventListener(RunService.PreRender, () => {
		const time = TimeSpan.now();
		
		const shakeStrength = peek(CharacterState.shakeStrengthAtom);
		setRotation(Shake.ui(shakeStrength, time, 3));
		
		const timeStart = peek(CharacterState.timeStartAtom);
		
		if (timeStart === undefined) {
			setText(defaultText);
			return;
		}
		
		const elapsedTime = TimeSpan.timeSince(timeStart);
		const milliseconds = millisecondsRichText.apply('%02d'.format(math.min(math.round(elapsedTime % 1 * 100), 99)));
		
		if (elapsedTime < 60) {
			setText('%d.%s'.format(math.floor(elapsedTime), milliseconds));
		} else if (elapsedTime < 3600) {
			const minutes = elapsedTime.idiv(60);
			const seconds = math.floor(elapsedTime % 60);
			
			setText('%d:%02d.%s'.format(minutes, seconds, milliseconds));
		} else {
			const hours = elapsedTime.idiv(3600);
			const minutes = elapsedTime.idiv(60) % 60;
			const seconds = math.floor(elapsedTime % 60);
			
			setText('%d:%02d:%02d.%s'.format(hours, minutes, seconds, milliseconds));
		}
	});
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
		>
			<Text
				styles={isStarted ? Styles.UI.hud.timer : Styles.UI.hud.timerUnstarted}
				text={text}
				alignX={Enum.TextXAlignment.Left}
				richText
				autoHeight
				autoWidth
				overrides={{
					Rotation: rotation,
				}}
			/>
		</frame>
	);
};

export default Timer;
