import React, { useEffect, useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { InputType } from 'client/inputType';
import { characterAtom } from 'client/character/atoms';
import { stylesAtom } from 'client/ui/styles';
import Text from '../Text';

const MoveHint: React.FC = () => {
	const character = useAtom(characterAtom);
	const inputType = useAtom(InputType.stateAtom);
	
	const [isVisible, setVisible] = useState<boolean>(true);
	
	const styles = useAtom(stylesAtom);
	
	useEffect(() => {
		if (character === undefined) {
			setVisible(false);
			return;
		}
		
		setVisible(true);
		
		const onAttributeChanged = (attribute: string): void => {
			if (attribute !== 'startTime') {
				return;
			}
			
			if (character.model.GetAttribute('startTime') !== undefined) {
				setVisible(false);
			} else {
				setVisible(true);
			}
		};
		
		onAttributeChanged('startTime');
		const attributeChangedEvent = character.model.AttributeChanged.Connect(onAttributeChanged);
		
		return () => {
			attributeChangedEvent.Disconnect();
		};
	}, [character]);
	
	if (!isVisible) {
		return undefined;
	}
	
	if (inputType === InputType.Value.Touch) {
		return (
			<Text
				styles={styles.text.moveHint}
				text={'[tap the screen to move]'}
				order={0}
				automaticWidth
				automaticHeight
			/>
		);
	} else if (inputType === InputType.Value.Controller) {
		return (
			<Text
				styles={styles.text.moveHint}
				text={'[use the right joystick to move]'}
				order={0}
				automaticWidth
				automaticHeight
			/>
		);
	}
	
	return undefined;
};

export default MoveHint;
