import React, { useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import Immut from '@rbxts/immut';

import { ClientSettings } from 'client/client-settings';

import { DropdownContext } from 'client/ui/contexts/dropdown';

import ScrollingItems from '../ScrollingItems';

import Checkbox from './Inputs/Checkbox';
import Dropdown from './Inputs/Dropdown';
import Slider from './Inputs/Slider';

interface SettingsProps {
	slope: number;
	scrollingFrameRef: React.RefObject<ScrollingFrame>;
}

const Settings: React.FC<SettingsProps> = ({ slope, scrollingFrameRef }) => {
	const [currentDropdown, setCurrentDropdown] = useState<string>();
	
	const userSettings = useAtom(ClientSettings.stateAtom);
	
	return ( // TODO: categories
		<DropdownContext.Provider
			value={{
				currentDropdown,
				open: setCurrentDropdown,
				close: () => setCurrentDropdown(undefined),
			}}
		>
			<ScrollingItems
				slope={slope}
				scrollingFrameRef={scrollingFrameRef}
			>
				<Dropdown
					label={'Hide Others'}
					value={['Never', 'Always', 'Non-Friends']}
					index={userSettings.general.hideOthers}
					onSelect={(index) => {
						ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
							draft.general.hideOthers = index;
						}));
					}}
				/>
				<Checkbox
					label={'Show Range'}
					checked={userSettings.character.showRange}
					onToggle={(checked) => {
						ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
							draft.character.showRange = checked;
						}));
					}}
				/>
				<Slider
					label={'Area Check Interval'}
					value={userSettings.performance.areaUpdateInterval}
					min={0.1}
					max={1}
					step={0.05}
					decimals={2}
					onChange={(newValue) => {
						ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
							draft.performance.areaUpdateInterval = newValue;
						}));
					}}
				/>
				<Dropdown
					label={'Performance Display'}
					value={['Off', 'With Labels', 'Without Labels']}
					index={userSettings.ui.topbar.performanceDisplay}
					onSelect={(index) => {
						ClientSettings.stateAtom((userSettings) => Immut.produce(userSettings, (draft) => {
							draft.ui.topbar.performanceDisplay = index;
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
		</DropdownContext.Provider>
	);
};

export default Settings;
