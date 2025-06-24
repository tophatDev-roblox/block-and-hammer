import React, { useEffect, useState } from '@rbxts/react';

import { useStylesContext } from 'client/ui/providers/styles';
import { useGameContext } from 'client/ui/providers/game';
import Text from '../Text';
import { InputType } from 'client/inputType';

const MoveHint: React.FC = () => {
	const { styles } = useStylesContext();
	const { cube, inputType } = useGameContext();
	
	const [isVisible, setVisible] = useState<boolean>(true);
	
	useEffect(() => {
		if (cube === undefined) {
			setVisible(false);
			return;
		}
		
		setVisible(true);
		
		const onAttributeChanged = (attribute: string): void => {
			if (attribute !== 'startTime') {
				return;
			}
			
			if (cube.GetAttribute('startTime') !== undefined) {
				setVisible(false);
			} else {
				setVisible(true);
			}
		};
		
		onAttributeChanged('startTime');
		const attributeChangedEvent = cube.AttributeChanged.Connect(onAttributeChanged);
		
		return () => {
			attributeChangedEvent.Disconnect();
		};
	}, [cube]);
	
	if (!isVisible) {
		return undefined;
	}
	
	if (inputType === InputType.Touch) {
		return (
			<Text
				styles={styles.text.moveHint}
				text={'[tap the screen to move]'}
				order={0}
				automaticHeight
			/>
		);
	} else if (inputType === InputType.Controller) {
		return (
			<Text
				styles={styles.text.moveHint}
				text={'[use the right joystick to move]'}
				order={0}
				automaticHeight
			/>
		);
	}
	
	return undefined;
};

export default MoveHint;
