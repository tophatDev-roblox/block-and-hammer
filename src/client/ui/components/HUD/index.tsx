import React, { useEffect, useRef } from '@rbxts/react';

import { effect } from '@rbxts/charm';

import { Styles } from 'client/styles';

import { CharacterState } from 'client/character/state';

import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import ScreenGUI from '../ScreenGUI';

import Speedometer from './Speedometer';
import Altitude from './Altitude';
import Timer from './Timer';

const HUD: React.FC = () => {
	const bodyRef = useRef<Part>();
	
	const px = usePx();
	
	useEffect(() => {
		return effect(() => {
			const characterParts = CharacterState.partsAtom();
			
			bodyRef.current = characterParts?.body;
		});
	}, []);
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.HUD}
		>
			<UIPadding
				padding={px(Styles.UI.hud.padding)}
			/>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					alignX={Enum.HorizontalAlignment.Center}
					alignY={Enum.VerticalAlignment.Bottom}
					gap={px(Styles.UI.hud.listPadding)}
				/>
				<Speedometer
					bodyRef={bodyRef}
				/>
				<Altitude
					bodyRef={bodyRef}
				/>
			</frame>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					alignX={Enum.HorizontalAlignment.Left}
					alignY={Enum.VerticalAlignment.Bottom}
					gap={px(Styles.UI.hud.listPadding)}
				/>
				<Timer />
			</frame>
		</ScreenGUI>
	);
};

export default HUD;
