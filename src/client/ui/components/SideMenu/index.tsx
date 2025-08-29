import React, { useBinding, useCallback, useEffect } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { setTimeout, throttle } from '@rbxts/set-timeout';
import { batch, peek } from '@rbxts/charm';

import { Assets } from 'shared/assets';

import { Camera } from 'client/camera';

import { Styles } from 'client/styles';

import { Character } from 'client/character';

import { TransitionState } from 'client/ui/transition-state';
import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import SideButton from '../SideButton';
import ScreenGUI from '../ScreenGUI';
import UIGradient from '../UIGradient';

import ButtonLayout from './ButtonLayout';
import Panel from './Panel';

const SideMenu: React.FC = () => {
	const [enabled, setEnabled] = useBinding<boolean>(false);
	
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	const uiState = useAtom(UI.stateAtom);
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(1, 0));
	
	const px = usePx();
	
	const offsetTopX = viewportSize.X * 0.65;
	const offsetBottomX = offsetTopX + px(100);
	
	const slope = math.abs(offsetTopX - offsetBottomX) / viewportSize.Y;
	
	const buttonHeight = px(Styles.UI.sideButton.text.size + Styles.UI.sideButton.padding * 2);
	const buttonGap = px(20);
	
	const togglePanel = useCallback(throttle((panel: UI.SideMenu.Panel) => {
		const currentPanel = peek(UI.SideMenu.panelAtom);
		
		let nextPanel = panel;
		
		if (currentPanel === panel) {
			UI.SideMenu.isClosingPanelAtom(true);
			
			nextPanel = UI.SideMenu.Panel.None;
		} else {
			if (currentPanel === UI.SideMenu.Panel.None) {
				UI.SideMenu.panelAtom(panel);
				
				return;
			} else {
				UI.SideMenu.isClosingPanelAtom(true);
			}
		}
		
		setTimeout(() => {
			if (peek(UI.stateAtom) !== UI.State.SideMenu) {
				return;
			}
			
			batch(() => {
				UI.SideMenu.panelAtom(nextPanel);
				UI.SideMenu.isClosingPanelAtom(false);
			});
		}, 0.6);
	}, 0.6), []);
	
	useEffect(() => {
		if (uiState === UI.State.SideMenu) {
			positionMotion.tween(UDim2.fromScale(0, 0), {
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.Out,
				time: 0.6,
			});
			
			setEnabled(true);
		} else {
			positionMotion.tween(UDim2.fromScale(0.6, 0), {
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.In,
				time: 0.6,
			});
			
			return setTimeout(() => setEnabled(false), 0.6);
		}
	}, [uiState]);
	
	return (
		<ScreenGUI
			DisplayOrder={UI.DisplayOrder.SideMenu}
			Enabled={enabled}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Position={position}
			>
				<frame
					BackgroundTransparency={1}
					Size={UDim2.fromScale(2, 1)}
					Position={UDim2.fromOffset(offsetBottomX + buttonGap, 0)}
					ZIndex={2}
				>
					<UIPadding
						padding={[buttonGap * 2, 0]}
					/>
					<UIListLayout
						fillDirection={Enum.FillDirection.Vertical}
						gap={buttonGap}
						alignY={Enum.VerticalAlignment.Bottom}
						alignX={Enum.HorizontalAlignment.Right}
					/>
					<ButtonLayout
						buttonHeight={buttonHeight}
						slope={slope * (buttonHeight + buttonGap)}
						sideMenuOpen={uiState === UI.State.SideMenu}
					>
						<SideButton
							text={'Inventory'}
							icon={Assets.Icons.InventoryIcon}
							onClick={() => {
								TransitionState.beginTransitionAtom()
									.then((didTransition) => {
										if (!didTransition) {
											return;
										}
										
										UI.stateAtom(UI.State.Inventory);
									});
							}}
						/>
						<SideButton
							text={'Badges'}
							icon={Assets.Icons.BadgesIcon}
							onClick={() => {}}
						/>
						<SideButton
							text={'Settings'}
							icon={Assets.Icons.SettingsIcon}
							onClick={() => togglePanel(UI.SideMenu.Panel.Settings)}
						/>
						<SideButton
							text={'Spectate'}
							icon={Assets.Icons.SpectateIcon}
							onClick={() => {}}
						/>
						<SideButton
							text={'Reset'}
							icon={''}
							onClick={() => {
								TransitionState.beginTransitionAtom()
									.then((didTransition) => {
										if (!didTransition) {
											return;
										}
										
										Character.quickReset();
										UI.stateAtom(UI.State.Game);
									});
							}}
						/>
						<SideButton
							text={'Start Screen'}
							icon={Assets.Icons.StartMenuIcon}
							onClick={() => {
								if (peek(TransitionState.isTransitioningAtom)) {
									return;
								}
								
								TransitionState.beginTransitionAtom()
									.then((didTransition) => {
										if (!didTransition) {
											return;
										}
										
										UI.stateAtom(UI.State.StartScreen)
									});
							}}
						/>
					</ButtonLayout>
				</frame>
				<frame
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0, 0)}
					Position={UDim2.fromOffset(offsetTopX, 0)}
					Rotation={math.deg(math.atan2(viewportSize.Y, offsetBottomX - offsetTopX))}
					ZIndex={1}
				>
					<frame
						{...Styles.applyBackgroundColorProps(Styles.UI.sideMenu.background)}
						Size={UDim2.fromOffset(viewportSize.X * 2, viewportSize.Y * 2)}
						AnchorPoint={new Vector2(0, 1)}
					>
						{Styles.UI.sideMenu.background.type === 'gradient' && (
							<UIGradient
								styles={Styles.UI.sideMenu.background}
							/>
						)}
						<uicorner
							CornerRadius={new UDim(0, 1)}
						/>
					</frame>
				</frame>
			</frame>
			<Panel />
		</ScreenGUI>
	);
};

export default SideMenu;

