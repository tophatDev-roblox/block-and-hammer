import { GuiService } from '@rbxts/services';

import React, { useBinding, useEffect, useRef } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { setTimeout } from '@rbxts/set-timeout';

import { Camera } from 'client/camera';

import { Styles } from 'client/styles';

import { useAtomBinding } from 'client/ui/hooks/use-atom-binding';
import { usePx } from 'client/ui/hooks/use-px';
import { UI } from 'client/ui/state';

import UIListLayout from '../../UIListLayout';
import UIPadding from '../../UIPadding';
import Gradient from '../../Gradient';

import Settings from './Settings';

const Panel: React.FC = () => {
	const scrolllingFrameRef = useRef<ScrollingFrame>();
	
	const [contentHeight, setContentHeight] = useBinding<number>(2160);
	const [contentY, setContentY] = useBinding<number>(0);
	const [visible, setVisible] = useBinding<boolean>(false);
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(-0.6, 0));
	
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	const panel = useAtom(UI.SideMenu.panelAtom);
	const isClosingPanel = useAtom(UI.SideMenu.isClosingPanelAtom);
	const uiState = useAtom(UI.stateAtom);
	
	const viewportSizeBinding = useAtomBinding(Camera.viewportSizeAtom);
	
	const [inset] = GuiService.GetGuiInset();
	
	const px = usePx();
	
	const scrollbarHeight = React.joinBindings({ contentHeight, viewportSize: viewportSizeBinding })
		.map(({ contentHeight, viewportSize }) => (viewportSize.Y / contentHeight) * viewportSize.Y);
	
	const scrollbarPosition = React.joinBindings({ scrollbarHeight, contentY, contentHeight, viewportSize: viewportSizeBinding })
		.map(({ scrollbarHeight, contentY, contentHeight, viewportSize }) => (contentY / (contentHeight - viewportSize.Y)) * (viewportSize.Y - scrollbarHeight));
	
	const offsetTopX = math.round(viewportSize.X * 0.55);
	const offsetBottomX = offsetTopX + px(100);
	
	const rotation = math.deg(math.atan2(viewportSize.Y, offsetBottomX - offsetTopX));
	const slope = math.abs(offsetTopX - offsetBottomX) / viewportSize.Y;
	
	const scrollbarThickness = px(20);
	
	useEffect(() => {
		if (panel !== UI.SideMenu.Panel.None && uiState === UI.State.SideMenu && !isClosingPanel) {
			positionMotion.tween(UDim2.fromScale(0, 0), {
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.Out,
				time: 0.6,
			});
			
			setVisible(true);
		} else {
			positionMotion.tween(UDim2.fromScale(-0.6, 0), {
				style: Enum.EasingStyle.Back,
				direction: Enum.EasingDirection.In,
				time: 0.6,
			});
			
			return setTimeout(() => setVisible(false), 0.6);
		}
	}, [panel, uiState, isClosingPanel]);
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
			Position={position}
			Visible={visible}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0, 0)}
				Position={UDim2.fromOffset(offsetTopX, 0)}
				Rotation={rotation}
				ZIndex={1}
			>
				<frame
					{...Styles.applyBackgroundColorProps(Styles.UI.panel.background)}
					Size={UDim2.fromOffset(viewportSize.X * 2, viewportSize.Y * 2)}
					AnchorPoint={new Vector2(0.5, 0)}
				>
					{Styles.UI.panel.background.type === 'gradient' && (
						<Gradient
							styles={Styles.UI.panel.background}
						/>
					)}
					<uicorner
						CornerRadius={new UDim(0, 1)}
					/>
				</frame>
			</frame>
			<frame
				BackgroundTransparency={1}
				Position={UDim2.fromOffset(offsetTopX - scrollbarThickness, 0)}
				Size={new UDim2(0, offsetBottomX - offsetTopX + scrollbarThickness, 1, 0)}
				ZIndex={2}
			>
				<canvasgroup
					BackgroundTransparency={1}
					Size={scrollbarHeight.map((scrollbarHeight) => new UDim2(1, 0, 0, scrollbarHeight))}
					Position={scrollbarPosition.map((scrollbarPosition) => UDim2.fromOffset(0, scrollbarPosition))}
				>
					<frame
						BackgroundTransparency={1}
						Position={scrollbarPosition.map((scrollbarPosition) => UDim2.fromOffset(scrollbarThickness - px(1), -scrollbarPosition))}
						Size={UDim2.fromScale(0, 0)}
						Rotation={rotation}
					>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromOffset(viewportSize.X * 2, viewportSize.Y * 2)}
							AnchorPoint={new Vector2(0, 1)}
						>
							<uistroke
								Color={Color3.fromRGB(255, 255, 255)}
								Transparency={0.7}
								Thickness={scrollbarThickness}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
						</frame>
					</frame>
				</canvasgroup>
			</frame>
			<scrollingframe
				ref={scrolllingFrameRef}
				BackgroundTransparency={1}
				Size={new UDim2(0, offsetBottomX, 1, 0)}
				CanvasSize={UDim2.fromScale(0, 1)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				ScrollBarThickness={0}
				ZIndex={3}
				Change={{
					AbsoluteCanvasSize: (scrollingFrame) => setContentHeight(scrollingFrame.AbsoluteCanvasSize.Y),
					CanvasPosition: (scrollingFrame) => setContentY(scrollingFrame.CanvasPosition.Y),
				}}
			>
				<UIPadding
					padding={[inset.Y + px(10), 0, px(40), 0]}
				/>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					padding={px(15)}
				/>
				{visible && (
					panel === UI.SideMenu.Panel.Settings && (
						<Settings
							slope={slope}
							scrollingFrameRef={scrolllingFrameRef}
						/>
					)
				)}
			</scrollingframe>
		</frame>
	);
};

export default Panel;
