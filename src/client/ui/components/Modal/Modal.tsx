import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Assets } from 'shared/assets';
import { usePx } from 'client/ui/hooks/usePx';
import { Styles } from 'client/styles';
import UIListLayout from '../UIListLayout';
import UIPadding from '../UIPadding';
import Container from '../Container';
import Text from '../Text';
import Action from './Action';

interface ModalProps<T extends Array<string>> {
	title: string;
	body: string | React.ReactNode;
	dismissable: boolean;
	actions: T;
	onAction?: (action: T[number]) => void;
	onDismiss?: () => void;
}

// TODO: improve ui navigation for controllers
const Modal: React.FC<ModalProps<Array<string>>> = ({ title, body, dismissable, actions, onAction, onDismiss }) => {
	const styles = useAtom(Styles.stateAtom);
	
	const px = usePx();
	
	return (
		<frame
			key={'Modal'}
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(px(1100), px(600))}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
		>
			<Container
				styles={styles.modal.container}
				width={new UDim(1, 0)}
				height={new UDim(1, 0)}
			>
				<>
					{/* wrapping in fragment for workaround: https://github.com/jsdotlua/react-lua/issues/42 */}
					<uicorner
						CornerRadius={new UDim(0, px(40))}
					/>
					<UIListLayout
						fillDirection={Enum.FillDirection.Vertical}
						padding={px(12)}
					/>
					<UIPadding
						padding={px(15)}
					/>
					<frame
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0)}
						AutomaticSize={Enum.AutomaticSize.Y}
						LayoutOrder={0}
					>
						<Text
							styles={styles.modal.text.title}
							text={title}
							automaticHeight
						/>
						{dismissable && (
							<imagebutton
								BackgroundTransparency={1}
								Size={UDim2.fromOffset(px(60), px(60))}
								Position={UDim2.fromScale(1, 0)}
								AnchorPoint={new Vector2(1, 0)}
								Image={Assets.Icons.CloseIcon}
								AutoButtonColor={false}
								Event={{
									MouseButton1Click: onDismiss,
								}}
							/>
						)}
					</frame>
					<scrollingframe
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 0)}
						CanvasSize={UDim2.fromScale(1, 0)}
						ScrollBarThickness={px(15)}
						AutomaticCanvasSize={Enum.AutomaticSize.Y}
						ScrollingDirection={Enum.ScrollingDirection.Y}
						LayoutOrder={1}
					>
						<uiflexitem
							FlexMode={Enum.UIFlexMode.Grow}
						/>
						<UIPadding
							padding={px(10)}
						/>
						{typeIs(body, 'string') ? (
							<Text
								styles={styles.modal.text.body.paragraph}
								text={body}
								alignX={Enum.TextXAlignment.Left}
								automaticHeight
								wrapped
							/>
						) : body}
					</scrollingframe>
					{actions.size() > 0 && (
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 0)}
							AutomaticSize={Enum.AutomaticSize.Y}
							LayoutOrder={2}
						>
							<UIListLayout
								fillDirection={Enum.FillDirection.Horizontal}
								padding={px(12)}
							/>
							{actions.map((action, i) => (
								<Action
									styles={styles.modal.actionButton}
									action={action}
									index={i}
									autoSelect={i === 0}
									selectable
									onClick={() => onAction?.(action)}
								/>
							))}
						</frame>
					)}
				</>
			</Container>
		</frame>
	);
};

export default Modal;
