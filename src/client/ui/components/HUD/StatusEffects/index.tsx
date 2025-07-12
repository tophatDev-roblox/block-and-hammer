import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { StyleParse, Styles } from 'shared/styles';

import { CharacterState } from 'client/character/state';
import { usePx } from 'client/ui/hooks/usePx';

import UIListLayout from '../../UIListLayout';

import Effect from './Effect';

const StatusEffects: React.FC = () => {
	const statusEffects = useAtom(CharacterState.statusEffectsAtom);
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
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
				// cant set `Rotation` because it breaks the `RadialProgress` component for some reason
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
