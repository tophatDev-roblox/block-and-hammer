import React from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import Immut from '@rbxts/immut';

import { ClientSettings } from 'client/client-settings';

import ScrollingItems from '../ScrollingItems';

import Checkbox from './Inputs/Checkbox';

interface SettingsProps {
	slope: number;
}

const Settings: React.FC<SettingsProps> = ({ slope }) => {
	const userSettings = useAtom(ClientSettings.stateAtom);
	
	return (
		<ScrollingItems
			slope={slope}
		>
			<Checkbox
				label={'Show Range'}
				checked={userSettings.character.showRange}
				onToggle={(checked) => {
					ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
						draft.character.showRange = checked;
					}));
				}}
			/>
			<Checkbox
				label={'Display Performance'}
				checked={userSettings.ui.topbar.displayPerformance}
				onToggle={(checked) => {
					ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
						draft.ui.topbar.displayPerformance = checked;
					}));
				}}
			/>
			<Checkbox
				label={'Performance Labels'}
				checked={userSettings.ui.topbar.showPerformanceLabels}
				onToggle={(checked) => {
					ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
						draft.ui.topbar.showPerformanceLabels = checked;
					}));
				}}
			/>
			<Checkbox
				label={'Enable Haptic Vibrations'}
				checked={userSettings.haptics.enabled}
				onToggle={(checked) => {
					ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
						draft.haptics.enabled = checked;
					}));
				}}
			/>
		</ScrollingItems>
	);
};

export default Settings;
