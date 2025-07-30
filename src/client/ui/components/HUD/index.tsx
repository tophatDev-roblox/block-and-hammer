import { GuiService } from '@rbxts/services';

import React, { useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { setTimeout } from '@rbxts/set-timeout';
import { subscribe } from '@rbxts/charm';

import { LocationState } from 'client/ui/location-state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';

import StatusEffects from './StatusEffects';
import Speedometer from './Speedometer';
import Altitude from './Altitude';
import MoveHint from './MoveHint';

const HudGUI: React.FC = () => {
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(0, 0));
	
	const px = usePx();
	
	useEffect(() => {
		return subscribe(LocationState.pathAtom, (path, previousPath) => {
			const isPanelOpen = LocationState.match('/game/side-menu/:panel', path) !== undefined;
			const wasPanelOpen = LocationState.match('/game/side-menu/:panel', previousPath) !== undefined;
			if (isPanelOpen === wasPanelOpen) {
				return;
			}
			
			const target = isPanelOpen ? {
				position: UDim2.fromScale(0, 1),
			} : {
				position: UDim2.fromScale(0, 0),
			};
			
			if (!GuiService.ReducedMotionEnabled) {
				if (isPanelOpen) {
					positionMotion.tween(target.position, {
						time: 0.6,
						style: Enum.EasingStyle.Back,
						direction: Enum.EasingDirection.In,
					});
				} else {
					setTimeout(() => {
						positionMotion.tween(target.position, {
							time: 0.6,
							style: Enum.EasingStyle.Back,
							direction: Enum.EasingDirection.Out,
						});
					}, 0.4);
				}
			} else {
				positionMotion.immediate(target.position);
			}
		});
	}, []);
	
	return (
		<screengui
			key={'HudGUI'}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			DisplayOrder={2}
			ResetOnSpawn={false}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Position={position}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					alignX={Enum.HorizontalAlignment.Center}
					alignY={Enum.VerticalAlignment.Bottom}
					padding={px(6)}
				/>
				<UIPadding
					padding={px(8)}
				/>
				<MoveHint />
				<StatusEffects />
				<Speedometer />
				<Altitude />
			</frame>
		</screengui>
	);
};

export default HudGUI;
