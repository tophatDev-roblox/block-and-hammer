import { TweenService } from '@rbxts/services';
import React, { useEffect, useRef } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Styles } from 'client/styles';
import { SideMenu as ClientSideMenu } from 'client/sideMenu';
import { usePx } from 'client/ui/hooks/usePx';
import Container from '../Container';
import Button from '../Button';

const SideMenu: React.FC = () => {
	const frameRef = useRef<Frame>();
	const tweenRef = useRef<Tween>();
	
	const styles = useAtom(Styles.stateAtom);
	const sideMenuOpened = useAtom(ClientSideMenu.isOpenAtom);
	
	const px = usePx();
	
	useEffect(() => {
		const frame = frameRef.current;
		if (frame === undefined) {
			return;
		}
		
		tweenRef.current?.Cancel();
		
		const tweenInfo = sideMenuOpened
			? new TweenInfo(0.6, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
			: new TweenInfo(0.6, Enum.EasingStyle.Back, Enum.EasingDirection.In);
		
		const tween = TweenService.Create(frame, tweenInfo, {
			Position: sideMenuOpened ? new UDim2(1, 0, 0, 0) : new UDim2(1.5, 0, 0, 0),
		});
		
		tween.Play();
		tweenRef.current = tween;
		
		tween.Completed.Connect(() => {
			tween.Destroy();
			tweenRef.current = undefined;
		});
	}, [sideMenuOpened]);
	
	return (
		<screengui
			DisplayOrder={3}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				ref={frameRef}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(1.5, 0, 0, 0)}
				AnchorPoint={new Vector2(1, 0)}
			>
				<uiaspectratioconstraint
					AspectRatio={650 / 1080}
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
							PaddingLeft={new UDim(0, px(60))}
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
							<Button
								styles={styles.buttons.sideMenu}
								text={'Inventory'}
								iconId={''}
							/>
							<Button
								styles={styles.buttons.sideMenu}
								text={'Badges'}
								iconId={''}
								widthOffset={px(-10)}
							/>
							<Button
								styles={styles.buttons.sideMenu}
								text={'Settings'}
								iconId={''}
								widthOffset={px(-20)}
							/>
							<Button
								styles={styles.buttons.sideMenu}
								text={'Spectate'}
								iconId={''}
								widthOffset={px(-30)}
							/>
							<Button
								styles={styles.buttons.sideMenu}
								text={'Reset'}
								iconId={'79494611958305'}
								widthOffset={px(-40)}
							/>
							<Button
								styles={styles.buttons.sideMenu}
								text={'Start Menu'}
								iconId={'79239443855874'}
								widthOffset={px(-50)}
							/>
						</frame>
					</>
				</Container>
			</frame>
		</screengui>
	);
};

export default SideMenu;
