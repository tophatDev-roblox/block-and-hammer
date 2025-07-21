import { RunService } from '@rbxts/services';

import React, { useBinding } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { peek } from '@rbxts/charm';

import { StyleParse, Styles } from 'shared/styles';
import { TimeSpan } from 'shared/time-span';
import { Shake } from 'shared/shake';

import { CharacterState } from 'client/character/state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../../UIListLayout';

import Effect from './Effect';

const StatusEffects: React.FC = () => {
	const [rotation, setRotation] = useBinding<number>(0);
	
	const statusEffects = useAtom(CharacterState.statusEffectsAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	useEventListener(RunService.PreSimulation, () => {
		const time = TimeSpan.now();
		setRotation(Shake.ui(peek(CharacterState.shakeStrengthAtom), time, 4));
	});
	
	return (
		<frame
			key={'StatusEffects'}
			BackgroundTransparency={1}
			LayoutOrder={1}
			Size={UDim2.fromOffset(0, StyleParse.px(px, styles.hud.statusEffects.icons.size, styles.hud.statusEffects.icons.autoScale))}
			AutomaticSize={Enum.AutomaticSize.X}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0, 1)}
				AutomaticSize={Enum.AutomaticSize.X}
				Rotation={rotation}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Horizontal}
					padding={px(6)}
				/>
				{statusEffects.map((statusEffect, i) => (
					<Effect
						statusEffect={statusEffect}
						index={i}
					/>
				))}
			</frame>
		</frame>
	);
};

export default StatusEffects;
