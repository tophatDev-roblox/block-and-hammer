import React from '@rbxts/react';

import { Accessories } from 'shared/accessories';

import ModelPreview from './ModelPreview';

interface PreviewProps {
	accessory: Accessories.BaseAccessory;
}

const Preview: React.FC<PreviewProps> = ({ accessory }) => {
	switch (accessory.type) {
		case Accessories.Type.Model: {
			return (
				<ModelPreview
					accessory={accessory as Accessories.ModelAccessory}
				/>
			);
		}
		case Accessories.Type.Decal: { // TODO: <DecalPreview />
			return (
				<></>
			);
		}
	}
};

export default Preview;
