import { GuiService } from '@rbxts/services';

import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { setTimeout } from '@rbxts/set-timeout';

import { Assets } from 'shared/assets';
import { Styles } from 'shared/styles';

import { StartScreenState } from 'client/ui/startScreenState';
import { SideMenuState } from 'client/ui/sideMenuState';
import { ModalState } from 'client/ui/modalState';
import { usePx } from 'client/ui/hooks/usePx';

import ContainerImage from '../ContainerImage';
import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';

import MenuButton from './MenuButton';

const SideMenuGUI: React.FC = () => {
	const [selectable, setSelectable] = useState<boolean>(false);
	
	const styles = useAtom(Styles.stateAtom);
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	
	const px = usePx();
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(1.5, 0));
	
	const containerWidth = 750;
	const buttonGapOffset = -9 / containerWidth;
	const totalButtons = 6;
	
	useEffect(() => {
		const openPosition = UDim2.fromScale(1, 0);
		const closePosition = UDim2.fromScale(1.5, 0);
		if (!GuiService.ReducedMotionEnabled) {
			if (sideMenuOpened) {
				positionMotion.tween(openPosition, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.Out,
				});
				
				const clearTimeout = setTimeout(() => setSelectable(true), 0.3);
				
				return () => {
					clearTimeout();
				};
			} else {
				positionMotion.tween(closePosition, {
					time: 0.6,
					style: Enum.EasingStyle.Back,
					direction: Enum.EasingDirection.In,
				});
				
				setSelectable(false);
			}
		} else {
			if (sideMenuOpened) {
				positionMotion.immediate(openPosition);
				
				const clearTimeout = setTimeout(() => setSelectable(true), 0.05);
				
				return () => {
					clearTimeout();
				};
			} else {
				positionMotion.immediate(closePosition);
				setSelectable(false);
			}
		}
	}, [sideMenuOpened]);
	
	return (
		<screengui
			key={'SideMenuGUI'}
			DisplayOrder={3}
			ScreenInsets={Enum.ScreenInsets.None}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Position={position}
				AnchorPoint={new Vector2(1, 0)}
			>
				<uiaspectratioconstraint
					AspectRatio={containerWidth / 1080}
				/>
				<ContainerImage
					styles={styles.sideMenu.container}
					width={new UDim(1.5, 0)}
					height={new UDim(1, 0)}
					imageProps={{
						Image: Assets.Images.SideMenuBackground,
					}}
				>
					<>
						{/* wrapping in fragment for workaround: https://github.com/jsdotlua/react-lua/issues/42 */}
						<UIListLayout
							fillDirection={Enum.FillDirection.Vertical}
						/>
						<UIPadding
							padding={[0, 0, 0, px(80)]}
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
								padding={px(12)}
							/>
							<UIPadding
								padding={[px(12), 0, px(42), px(12)]}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Inventory'}
								iconId={Assets.Icons.InventoryIcon}
								index={0}
								totalButtons={totalButtons}
								selectable={selectable}
								autoSelect
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Badges'}
								iconId={Assets.Icons.BadgesIcon}
								widthScale={buttonGapOffset}
								index={1}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Settings'}
								iconId={Assets.Icons.SettingsIcon}
								widthScale={buttonGapOffset * 2}
								index={2}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Customize'}
								iconId={Assets.Icons.CustomizeIcon}
								widthScale={buttonGapOffset * 3}
								index={3}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Spectate'}
								iconId={Assets.Icons.SpectateIcon}
								widthScale={buttonGapOffset * 4}
								index={4}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Switch Level'}
								iconId={Assets.Icons.SwitchLevelIcon}
								widthScale={buttonGapOffset * 5}
								index={5}
								totalButtons={totalButtons}
								selectable={selectable}
							/>
							<MenuButton
								styles={styles.sideMenu.button}
								text={'Start Screen'}
								iconId={Assets.Icons.StartMenuIcon}
								widthScale={buttonGapOffset * 6}
								index={6}
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
					</>
				</ContainerImage>
			</frame>
		</screengui>
	);
};

export default SideMenuGUI;
