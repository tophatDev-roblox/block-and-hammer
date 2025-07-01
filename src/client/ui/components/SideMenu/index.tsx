import { GuiService } from '@rbxts/services';
import { setTimeout } from '@rbxts/set-timeout';
import React, { useEffect, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Assets } from 'shared/assets';
import { Styles } from 'client/styles';
import { SideMenuState } from 'client/sideMenuState';
import { usePx } from 'client/ui/hooks/usePx';
import { StartScreenState } from 'client/startScreenState';
import ContainerImage from '../ContainerImage';
import MenuButton from './MenuButton';

const SideMenu: React.FC = () => {
	const [selectable, setSelectable] = useState<boolean>(false);
	
	const styles = useAtom(Styles.stateAtom);
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	
	const px = usePx();
	const [position, positionMotion] = useMotion<UDim2>(new UDim2(1.5, 0, 0, 0));
	
	const containerWidth = 750;
	const buttonGapOffset = -10 / containerWidth;
	const totalButtons = 6;
	
	useEffect(() => {
		const openPosition = new UDim2(1, 0, 0, 0);
		const closePosition = new UDim2(1.5, 0, 0, 0);
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
			DisplayOrder={3}
			ScreenInsets={Enum.ScreenInsets.None}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
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
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
						/>
						<uipadding
							PaddingLeft={new UDim(0, px(80))}
						/>
						<frame
							BackgroundTransparency={1}
							Size={new UDim2(1, 0, 0, 0)}
						>
							<uiflexitem
								FlexMode={Enum.UIFlexMode.Grow}
							/>
							<uilistlayout
								FillDirection={Enum.FillDirection.Vertical}
								VerticalAlignment={Enum.VerticalAlignment.Bottom}
								Padding={new UDim(0, px(12))}
							/>
							<uipadding
								PaddingTop={new UDim(0, px(12))}
								PaddingBottom={new UDim(0, px(42))}
								PaddingLeft={new UDim(0, px(12))}
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
								text={'Start Screen'}
								iconId={Assets.Icons.StartMenuIcon}
								widthScale={buttonGapOffset * 5}
								index={5}
								totalButtons={totalButtons}
								selectable={selectable}
								onClick={() => {
									SideMenuState.isOpenAtom(false);
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

export default SideMenu;
