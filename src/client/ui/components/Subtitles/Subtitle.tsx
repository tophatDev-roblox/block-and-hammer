import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Styles } from 'client/styles';
import { usePx } from 'client/ui/hooks/usePx';
import UIPadding from '../UIPadding';
import Text from '../Text';
import Container from '../Container';
import { TimeSpan } from 'shared/timeSpan';

interface CaptionProps {
	sound: string;
	endTime: number;
	count: number;
	index: number;
}

const Subtitle: React.FC<CaptionProps> = ({ sound, endTime, count, index }) => {
	const [transparency, transparencyMotion] = useMotion<number>(0);
	
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	useEffect(() => {
		transparencyMotion.immediate(0);
		transparencyMotion.tween(1, {
			style: Enum.EasingStyle.Linear,
			time: TimeSpan.timeUntil(endTime),
		});
	}, [endTime]);
	
	return (
		<Container
			styles={styles.subtitles.container}
			order={index}
			automaticWidth
			automaticHeight
			properties={{
				BackgroundTransparency: transparency,
			}}
		>
			<>
				<UIPadding
					padding={px(10)}
				/>
				<Text
					styles={styles.subtitles.text}
					text={(count > 99 ? `99+ ` : count > 1 ? `${count}x ` : '') + sound}
					automaticWidth
					automaticHeight
					properties={{
						TextTransparency: transparency,
					}}
				/>
			</>
		</Container>
	);
};

export default Subtitle;
