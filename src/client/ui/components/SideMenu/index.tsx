import { GuiService } from '@rbxts/services';

import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { setTimeout } from '@rbxts/set-timeout';

import { StyleParse, Styles } from 'shared/styles';
import { Assets } from 'shared/assets';

import { StartScreenState } from 'client/ui/start-screen-state';
import { SideMenuState } from 'client/ui/side-menu-state';
import { ModalState } from 'client/ui/modal-state';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Gradient from '../Gradient';
import Outline from '../Outline';

import { getSideButtonSizes } from '../SideButton';

import MenuButton from './MenuButton';

const SideMenuGUI: React.FC = () => {
	const [selectable, setSelectable] = useState<boolean>(false);
	
	const styles = useAtom(Styles.stateAtom);
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(1.5, 0));
	const [rotation, rotationMotion] = useMotion<number>(20);
	
	const px = usePx();
	
	const {
		background,
		outline,
	} = styles.sideMenu.container;
	
	const isBackgroundRGBA = StyleParse.isRGBA(background);
	
	const buttonPadding = px(12);
	const [, height] = getSideButtonSizes(px, styles.sideMenu.button.text, buttonPadding);
	
	const baseMenuRotation = -10;
	const listPadding = px(12);
	const buttonGapOffset = (height + listPadding) * math.tan(math.rad(baseMenuRotation));
	const totalButtons = 6;
	
	useEffect(() => {
		const target = sideMenuOpened ? {
			position: UDim2.fromScale(1, 0),
			rotation: baseMenuRotation,
		} : {
			position: UDim2.fromScale(2, 0),
			rotation: 20,
		};
		
		if (!GuiService.ReducedMotionEnabled) {
			if (sideMenuOpened) {
				positionMotion.tween(target.position, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.Out,
				});
				
				rotationMotion.tween(target.rotation, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.Out,
				});
				
				const clearTimeout = setTimeout(() => setSelectable(true), 0.3);
				
				return () => {
					clearTimeout();
				};
			} else {
				positionMotion.tween(target.position, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.In,
				});
				
				rotationMotion.tween(target.rotation, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.In,
				});
				
				setSelectable(false);
			}
		} else {
			if (sideMenuOpened) {
				positionMotion.immediate(target.position);
				rotationMotion.immediate(target.rotation);
				
				const clearTimeout = setTimeout(() => setSelectable(true), 0.05);
				
				return () => {
					clearTimeout();
				};
			} else {
				positionMotion.immediate(target.position);
				rotationMotion.immediate(target.rotation);
				setSelectable(false);
			}
		}
	}, [sideMenuOpened]);
	
	return (
		<screengui
			key={'SideMenuGUI'}
			DisplayOrder={3}
			ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets}
			ResetOnSpawn={false}
			ClipToDeviceSafeArea={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0, px(700), 1, 0)}
				Position={position}
				AnchorPoint={new Vector2(1, 0)}
			>
				<frame
					BackgroundTransparency={1}
					Size={UDim2.fromScale(2, 1)}
				>
					<frame
						BackgroundColor3={isBackgroundRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={isBackgroundRGBA ? 1 - background.alpha : 0}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 2)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Rotation={rotation}
					>
						{!isBackgroundRGBA && (
							<Gradient
								styles={background}
							/>
						)}
						{outline !== undefined && (
							<Outline
								styles={outline}
								applyStrokeMode={Enum.ApplyStrokeMode.Contextual}
							/>
						)}
					</frame>
					<frame
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
					>
						<UIListLayout
							fillDirection={Enum.FillDirection.Vertical}
						/>
						<UIPadding
							padding={[0, 0, 0, px(20)]}
						/>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 0)}
							LayoutOrder={0}
						>
							<uiflexitem
								FlexMode={Enum.UIFlexMode.Grow}
							/>
							<UIListLayout
								fillDirection={Enum.FillDirection.Vertical}
								alignY={Enum.VerticalAlignment.Bottom}
								padding={listPadding}
							/>
							<UIPadding
								padding={[px(12), 0, px(42), px(12)]}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Inventory'}
								iconId={Assets.Icons.InventoryIcon}
								index={0}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
								autoSelect
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Badges'}
								iconId={Assets.Icons.BadgesIcon}
								widthOffset={buttonGapOffset}
								index={1}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Settings'}
								iconId={Assets.Icons.SettingsIcon}
								widthOffset={buttonGapOffset * 2}
								index={2}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Customize'}
								iconId={Assets.Icons.CustomizeIcon}
								widthOffset={buttonGapOffset * 3}
								index={3}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Spectate'}
								iconId={Assets.Icons.SpectateIcon}
								widthOffset={buttonGapOffset * 4}
								index={4}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Switch Level'}
								iconId={Assets.Icons.SwitchLevelIcon}
								widthOffset={buttonGapOffset * 5}
								index={5}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Start Screen'}
								iconId={Assets.Icons.StartMenuIcon}
								widthOffset={buttonGapOffset * 6}
								index={6}
								padding={buttonPadding}
								totalButtons={totalButtons}
								selectable={selectable}
								onClick={async () => {
									SideMenuState.isOpenAtom(false);
									
									const action = await ModalState.create({
										title: 'Start Screen',
										body: [
											'Are you sure you want to go to the start screen?',
											'Your progress will be reset and is not recoverable.',
											'TODO: make progress actually save lol',
										].join('\n'),
										dismissable: true,
										actions: ['Yes', 'Nevermind'] as const,
									});
									
									if (action !== 'Yes') {
										return;
									}
									
									StartScreenState.isVisibleAtom(true);
								}}
							/>
						</frame>
					</frame>
				</frame>
			</frame>
		</screengui>
	);
};

export default SideMenuGUI;
