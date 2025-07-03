import React, { useEffect, useRef } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { TimeSpan } from 'shared/timeSpan';
import { Styles } from 'client/styles';
import { usePx } from 'client/ui/hooks/usePx';
import UIPadding from '../UIPadding';
import Text from '../Text';
import Container from '../Container';

interface CaptionProps {
	sound: string;
	endTime: number;
	count: number;
	index: number;
}

const Subtitle: React.FC<CaptionProps> = ({ sound, endTime, count, index }) => {
	const containerRef = useRef<Frame>();
	
	const [yOffset, yOffsetMotion] = useMotion<number>(0);
	const [anchorPoint, anchorPointMotion] = useMotion<Vector2>(new Vector2(0, 1));
	const [transparency, transparencyMotion] = useMotion<number>(0);
	
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	useEffect(() => {
		const container = containerRef.current;
		if (container === undefined) {
			return;
		}
		
		yOffsetMotion.immediate(container.AbsoluteSize.Y * -index);
		anchorPointMotion.tween(new Vector2(1, 1), {
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.Out,
			time: 0.15,
		});
	}, []);
	
	useEffect(() => {
		const container = containerRef.current;
		if (container === undefined) {
			return;
		}
		
		yOffsetMotion.tween(container.AbsoluteSize.Y * -index, {
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.InOut,
			time: 0.3,
		});
	}, [index]);
	
	useEffect(() => {
		transparencyMotion.immediate(0);
		if (endTime < math.huge) {
			transparencyMotion.tween(1, {
				style: Enum.EasingStyle.Linear,
				time: TimeSpan.timeUntil(endTime),
			});
		}
	}, [endTime]);
	
	return (
		<Container
			ref={containerRef}
			styles={styles.subtitles.container}
			automaticWidth
			automaticHeight
			properties={{
				BackgroundTransparency: transparency,
				Position: yOffset.map((value) => new UDim2(1, 0, 0, value)),
				AnchorPoint: anchorPoint,
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
