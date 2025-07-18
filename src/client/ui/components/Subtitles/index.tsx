import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { usePx } from 'client/ui/hooks/use-px';
import { SFX } from 'client/sfx';

import Subtitle from './Subtitle';

const SubtitlesGUI: React.FC = () => {
	const subtitles = useAtom(SFX.subtitlesAtom);
	
	const px = usePx();
	
	return (
		<screengui
			key={'SubtitlesGUI'}
			DisplayOrder={2}
			ResetOnSpawn={false}
			IgnoreGuiInset
		>
			<frame
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(0, 0)}
				Position={new UDim2(1, 0, 1, px(-20))}
				AnchorPoint={new Vector2(1, 1)}
			>
				{subtitles.map(([sound, endTime, count], index) => (
					<Subtitle
						key={sound}
						sound={sound}
						endTime={endTime}
						count={count}
						index={index}
					/>
				))}
			</frame>
		</screengui>
	);
};

export default SubtitlesGUI;
