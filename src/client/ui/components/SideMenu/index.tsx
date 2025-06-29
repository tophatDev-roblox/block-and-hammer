import React, { useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';
import { useMotion } from '@rbxts/pretty-react-hooks';

import { Assets } from 'shared/assets';
import { Styles } from 'client/styles';
import { SideMenuState } from 'client/sideMenuState';
import { useGamepadNavigation } from 'client/ui/hooks/useGamepadNavigation';
import { usePx } from 'client/ui/hooks/usePx';
import Container from '../Container';
import MenuButton from './MenuButton';
import { StartScreenState } from 'client/startScreenState';

const SideMenu: React.FC = () => {
	const styles = useAtom(Styles.stateAtom);
	const sideMenuOpened = useAtom(SideMenuState.isOpenAtom);
	
	const px = usePx();
	const [position, positionMotion] = useMotion<UDim2>(new UDim2(1.5, 0, 0, 0));
	
	const [focusIndex, setFocusIndex] = useGamepadNavigation([
		new Vector2(0, 0),
		new Vector2(0, 1),
		new Vector2(0, 2),
		new Vector2(0, 3),
		new Vector2(0, 4),
		new Vector2(0, 5),
	]);
	
	const containerWidth = 750;
	const buttonGapOffset = -15 / containerWidth;
	const totalButtons = 6;
	
	useEffect(() => {
		if (sideMenuOpened) {
			setFocusIndex(0);
			positionMotion.tween(new UDim2(1, 0, 0, 0), {
				time: 0.6,
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.Out,
			});
		} else {
			setFocusIndex(-1);
			positionMotion.tween(new UDim2(1.5, 0, 0, 0), {
				time: 0.6,
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.In,
			});
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
				<Container
					styles={styles.containers.sideMenu}
					width={new UDim(1.5, 0)}
					height={new UDim(1, 0)}
					imageProps={{
						Image: 'rbxassetid://131216396630449',
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
								styles={styles.buttons.sideMenu}
								text={'Inventory'}
								iconId={Assets.Icons.InventoryIcon}
								index={0}
								totalButtons={totalButtons}
								focusIndex={focusIndex}
							/>
							<MenuButton
								styles={styles.buttons.sideMenu}
								text={'Badges'}
								iconId={Assets.Icons.BadgesIcon}
								widthScale={buttonGapOffset}
								index={1}
								focusIndex={focusIndex}
								totalButtons={totalButtons}
							/>
							<MenuButton
								styles={styles.buttons.sideMenu}
								text={'Settings'}
								iconId={Assets.Icons.SettingsIcon}
								widthScale={buttonGapOffset * 2}
								index={2}
								focusIndex={focusIndex}
								totalButtons={totalButtons}
							/>
							<MenuButton
								styles={styles.buttons.sideMenu}
								text={'Customize'}
								iconId={Assets.Icons.CustomizeIcon}
								widthScale={buttonGapOffset * 3}
								index={3}
								focusIndex={focusIndex}
								totalButtons={totalButtons}
							/>
							<MenuButton
								styles={styles.buttons.sideMenu}
								text={'Spectate'}
								iconId={Assets.Icons.SpectateIcon}
								widthScale={buttonGapOffset * 4}
								index={4}
								focusIndex={focusIndex}
								totalButtons={totalButtons}
							/>
							<MenuButton
								styles={styles.buttons.sideMenu}
								text={'Start Screen'}
								iconId={Assets.Icons.StartMenuIcon}
								widthScale={buttonGapOffset * 5}
								index={5}
								focusIndex={focusIndex}
								totalButtons={totalButtons}
								onClick={() => {
									SideMenuState.isOpenAtom(false);
									StartScreenState.isVisibleAtom(true);
								}}
							/>
						</frame>
					</>
				</Container>
			</frame>
		</screengui>
	);
};

export default SideMenu;
