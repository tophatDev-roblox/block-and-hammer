import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { useGameContext } from 'client/ui/providers/game';
import { InputType } from 'client/inputType';
import { stylesAtom } from 'client/ui/styles';
import Text from '../Text';

const MoveHint: React.FC = () => {
	const { character: characterParts, inputType } = useGameContext();
	
	const [isVisible, setVisible] = useState<boolean>(true);
	
	const styles = useAtom(stylesAtom);
	
	useEffect(() => {
		if (characterParts === undefined) {
			setVisible(false);
			return;
		}
		
		setVisible(true);
		
		const onAttributeChanged = (attribute: string): void => {
			if (attribute !== 'startTime') {
				return;
			}
			
			if (characterParts.model.GetAttribute('startTime') !== undefined) {
				setVisible(false);
			} else {
				setVisible(true);
			}
		};
		
		onAttributeChanged('startTime');
		const attributeChangedEvent = characterParts.model.AttributeChanged.Connect(onAttributeChanged);
		
		return () => {
			attributeChangedEvent.Disconnect();
		};
	}, [characterParts]);
	
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
