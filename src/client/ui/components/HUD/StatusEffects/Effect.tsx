import { RunService } from '@rbxts/services';

import React, { useBinding } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { StyleParse, Styles } from 'shared/styles';
import { TimeSpan } from 'shared/timeSpan';
import { Assets } from 'shared/assets';

import { CharacterState } from 'client/character/state';
import { StatusEffect } from 'client/statusEffect';
import { usePx } from 'client/ui/hooks/usePx';

import RadialProgress from '../../RadialProgress';
import Gradient from '../../Gradient';
import Outline from '../../Outline';

export const statusEffectIconMap = new Map<StatusEffect, Assets.Icons>([
	[StatusEffect.Ragdoll, Assets.Icons.RagdollEffectIcon],
	[StatusEffect.Dizzy, Assets.Icons.DizzyEffectIcon],
]);

interface EffectProps {
	statusEffect: CharacterState.StatusEffectData;
	index: number;
}

const Effect: React.FC<EffectProps> = ({ statusEffect, index }) => {
	const [progressRotation, setProgressRotation] = useBinding<number>(0);
	
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	const { background, outline, progress } = styles.hud.statusEffects.icons;
	const isRGBA = StyleParse.isRGBA(background);
	
	useEventListener(RunService.PreRender, () => {
		const percentage = 1 - TimeSpan.timeUntil(statusEffect.endTime) / statusEffect.duration;
		setProgressRotation(math.clamp(percentage * 360, 0, 360));
	});
	
	return (
		<frame
			key={statusEffect.effect}
			BackgroundColor3={isRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={isRGBA ? 1 - background.alpha : 0}
			Size={UDim2.fromScale(1, 1)}
			SizeConstraint={Enum.SizeConstraint.RelativeYY}
			BorderSizePixel={0}
			LayoutOrder={index}
		>
			<uicorner
				CornerRadius={new UDim(1, 0)}
			/>
			{!isRGBA && (
				<Gradient
					styles={background}
				/>
			)}
			{outline !== undefined && (
				<Outline
					styles={outline}
					applyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			)}
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={0}
			>
				<RadialProgress
					rotation={progressRotation}
					color={StyleParse.color(progress)}
					transparency={1 - progress.alpha}
				/>
			</frame>
			<imagelabel
				BackgroundTransparency={1}
				Size={new UDim2(1, px(-8), 1, px(-8))}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image={statusEffectIconMap.get(statusEffect.effect) ?? Assets.Icons.QuestionIcon}
				ImageTransparency={0.6}
				ZIndex={1}
			/>
		</frame>
	);
};

export default Effect;
