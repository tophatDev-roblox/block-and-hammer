import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { usePx } from 'client/ui/hooks/usePx';
import { SFX } from 'client/sfx';
import UIListLayout from '../UIListLayout';
import Subtitle from './Subtitle';

const SubtitlesGUI: React.FC = () => {
	const subtitles = useAtom(SFX.subtitlesAtom);
	
	const px = usePx();
	
	return (
		<screengui
			DisplayOrder={2}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				Position={new UDim2(1, 0, 1, px(-40))}
				AnchorPoint={new Vector2(1, 1)}
			>
				<UIListLayout
					fillDirection={Enum.FillDirection.Vertical}
					alignX={Enum.HorizontalAlignment.Right}
					alignY={Enum.VerticalAlignment.Bottom}
				/>
				{subtitles.map(([sound, endTime, count], index) => (
					<Subtitle
						sound={sound}
						endTime={endTime}
						count={count}
						index={-index}
					/>
				))}
			</frame>
		</screengui>
	);
};

export default SubtitlesGUI;
