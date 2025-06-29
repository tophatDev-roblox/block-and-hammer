import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { InputType } from 'client/inputType';
import { CharacterState } from 'client/character/state';
import { Styles } from 'client/styles';
import Text from '../Text';

const MoveHint: React.FC = () => {
	const timeStart = useAtom(CharacterState.timeStartAtom);
	const inputType = useAtom(InputType.stateAtom);
	
	const styles = useAtom(Styles.stateAtom);
	
	if (timeStart !== undefined) {
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
