import { GuiService } from '@rbxts/services';

import React, { useEffect, useMemo, useState } from '@rbxts/react';
import { useMotion } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { setTimeout } from '@rbxts/set-timeout';

import { StyleParse, Styles } from 'shared/styles';

import { LocationState } from 'client/ui/location-state';
import { UIConstants } from 'client/ui/constants';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Gradient from '../Gradient';
import Outline from '../Outline';
import Text from '../Text';

interface BasePanelProps extends React.PropsWithChildren {
	route: LocationState.Path;
	title: string;
}

const BasePanel: React.FC<BasePanelProps> = ({ route, title, children }) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	
	const styles = useAtom(Styles.stateAtom);
	const path = useAtom(LocationState.pathAtom);
	
	const isOpen = useMemo(() => LocationState.isAt(route, path), [path]);
	
	const [position, positionMotion] = useMotion<UDim2>(UDim2.fromScale(0, 2));
	
	const px = usePx();
	
	useEffect(() => {
		let cleanup: (() => void) | undefined = undefined;
		
		const target = isOpen ? {
			position: UDim2.fromScale(0, 1),
		} : {
			position: UDim2.fromScale(0, 2),
		};
		
		if (!GuiService.ReducedMotionEnabled) {
			if (isOpen) {
				positionMotion.immediate(UDim2.fromScale(-1, 1));
				setVisible(true);
			} else {
				cleanup = setTimeout(() => setVisible(false), 0.6);
			}
			
			positionMotion.tween(target.position, {
				time: 0.6,
				style: Enum.EasingStyle.Back,
				direction: isOpen ? Enum.EasingDirection.Out : Enum.EasingDirection.In,
			});
		} else {
			setVisible(isOpen);
			positionMotion.immediate(target.position);
		}
		
		return cleanup;
	}, [isOpen]);
	
	if (!isVisible) {
		return undefined;
	}
	
	const {
		background,
		outline,
	} = styles.panel.container;
	
	const isBackgroundRGBA = StyleParse.isRGBA(background);
	
	return (
		<frame
			BackgroundTransparency={1}
			Position={position}
			AnchorPoint={new Vector2(0, 1)}
			Size={UDim2.fromScale(1, 1)}
			key={title}
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(px(1100), px(850))}
				Position={UDim2.fromScale(0, 1)}
				AnchorPoint={new Vector2(0, 1)}
			>
				<canvasgroup
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1.5, 1.5)}
					Position={UDim2.fromScale(1.25, 0)}
					AnchorPoint={new Vector2(1, 0)}
				>
					<frame
						BackgroundColor3={isBackgroundRGBA ? StyleParse.color(background) : Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={isBackgroundRGBA ? 1 - background.alpha : 0}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1.75, 2)}
						Position={UDim2.fromScale(0, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Rotation={UIConstants.panelRotation}
					>
						{outline !== undefined && (
							<Outline
								styles={outline}
								applyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
						)}
						{!isBackgroundRGBA && (
							<Gradient
								styles={background}
							/>
						)}
					</frame>
				</canvasgroup>
				<frame
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1.1, 1)}
				>
					<UIListLayout
						fillDirection={Enum.FillDirection.Vertical}
						padding={px(16)}
					/>
					<UIPadding
						padding={[px(16), px(8), px(16), px(16)]}
					/>
					<Text
						styles={styles.panel.title}
						text={title}
						alignX={Enum.TextXAlignment.Left}
						order={0}
						automaticHeight
					/>
					<frame
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0)}
					>
						<uiflexitem
							FlexMode={Enum.UIFlexMode.Grow}
						/>
						<canvasgroup
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1.05, 1)}
							LayoutOrder={1}
						>
							<frame
								BackgroundColor3={Color3.fromRGB(0, 0, 0)}
								BackgroundTransparency={0.8}
								BorderSizePixel={0}
								Size={UDim2.fromScale(1.75, 2)}
								Position={UDim2.fromScale(0, 0.5)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Rotation={UIConstants.panelRotation}
							/>
						</canvasgroup>
						{children}
					</frame>
				</frame>
			</frame>
		</frame>
	);
};

export default BasePanel;
