import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { ModalState } from 'client/ui/modalState';
import Modal from './Modal';

const ModalGUI: React.FC = () => {
	const modalState = useAtom(ModalState.stateAtom);
	
	return (
		<screengui
			key={'ModalGUI'}
			DisplayOrder={20}
			ScreenInsets={Enum.ScreenInsets.None}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			{modalState !== undefined && (
				<Modal
					{...modalState}
					onAction={(action) => {
						modalState.callback(action);
						ModalState.dismiss();
					}}
					onDismiss={() => {
						modalState.callback();
						ModalState.dismiss();
					}}
				/>
			)}
		</screengui>
	);
};

export default ModalGUI;
