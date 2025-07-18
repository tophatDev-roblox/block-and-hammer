import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { InputType } from 'shared/input-type';
import { Styles } from 'shared/styles';

import { clientInputTypeAtom } from 'client/input';
import { CharacterState } from 'client/character/state';

import Text from '../Text';

const MoveHint: React.FC = () => {
	const timeStart = useAtom(CharacterState.timeStartAtom);
	const inputType = useAtom(clientInputTypeAtom);
	
	const styles = useAtom(Styles.stateAtom);
	
	if (timeStart !== undefined) {
		return undefined;
	}
	
	if (inputType === InputType.Touch) {
		return (
			<Text
				key={'MoveHint'}
				styles={styles.hud.text.moveHint}
				text={'[tap the screen to move]'}
				order={0}
				automaticWidth
				automaticHeight
			/>
		);
	} else if (inputType === InputType.Controller) {
		return (
			<Text
				key={'MoveHint'}
				styles={styles.hud.text.moveHint}
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
