import { RunService } from '@rbxts/services';
import React, { useBinding, useMemo } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';
import { peek } from '@rbxts/charm';

import { Shake } from 'shared/shake';
import { Units } from 'shared/units';
import { Styles } from 'client/styles';
import { CharacterState } from 'client/character/state';
import Text from '../Text';

const Altitude: React.FC = () => {
	const [text, setText] = useBinding<string>('--');
	const [rotation, setRotation] = useBinding<number>(0);
	
	const characterParts = useAtom(CharacterState.partsAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const labelFormat = useMemo(() => `%.${styles.text.hudPrimary.display.decimals}fm`, [styles.text.hudPrimary.display.decimals]);
	
	useEventListener(RunService.Stepped, (time) => {
		if (characterParts === undefined) {
			setText('--');
			setRotation(0);
			return;
		}
		
		const altitude = Units.studsToMeters(math.max(characterParts.body.Position.Y - characterParts.body.Size.Y / 2, 0));
		setText(labelFormat.format(altitude));
		setRotation(Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 2));
	});
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
		>
			<Text
				styles={styles.text.hudPrimary}
				text={text}
				order={2}
				rotation={rotation}
				automaticWidth
				automaticHeight
			/>
		</frame>
	);
};

export default Altitude;
