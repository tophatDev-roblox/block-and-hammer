import { HttpService } from '@rbxts/services';

import React, { useState } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { Assets } from 'shared/assets';

import { Camera } from 'client/camera';

import { Styles } from 'client/styles';

import { useDropdownContext } from 'client/ui/contexts/dropdown';
import { usePx } from 'client/ui/hooks/use-px';

import UIListLayout from 'client/ui/components/UIListLayout';
import UIPadding from 'client/ui/components/UIPadding';
import Gradient from 'client/ui/components/Gradient';
import Button from 'client/ui/components/Button';
import Text from 'client/ui/components/Text';

import Item from './Item';

interface DropdownProps<T> {
	label: string;
	value: Array<string>;
	index: T;
	onSelect: (newIndex: T) => void;
}

const Dropdown = <T extends number>({ label, value, index, onSelect }: DropdownProps<T>) => {
	const [dropdownId] = useState<string>(HttpService.GenerateGUID());
	
	const viewportSize = useAtom(Camera.viewportSizeAtom);
	
	const { currentDropdown, open, close } = useDropdownContext();
	
	const px = usePx();
	
	const settingsStyles = Styles.UI.panel.settings;
	
	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0, viewportSize.X * 0.5, 0, px(settingsStyles.item.label.size + settingsStyles.item.padding * 2))}
		>
			<Button
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={2}
				Event={{
					MouseButton1Click: () => {
						if (currentDropdown !== dropdownId) {
							open(dropdownId);
						} else {
							close();
						}
					},
				}}
			>
				<uicorner
					CornerRadius={new UDim(1, 0)}
				/>
			</Button>
			<frame
				{...Styles.applyBackgroundColorProps(settingsStyles.item.background)}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={1}
			>
				{settingsStyles.item.background.type === 'gradient' && (
					<Gradient
						styles={settingsStyles.item.background}
					/>
				)}
				<UIListLayout
					fillDirection={Enum.FillDirection.Horizontal}
					alignY={Enum.VerticalAlignment.Center}
				/>
				<UIPadding
					padding={px(settingsStyles.item.padding)}
					overrides={{
						PaddingLeft: new UDim(0, px(settingsStyles.item.padding * 2)),
					}}
				/>
				<uicorner
					CornerRadius={new UDim(1, 0)}
				/>
				<Text
					styles={settingsStyles.item.label}
					text={label}
					alignX={Enum.TextXAlignment.Left}
					autoHeight
					autoWidth
				>
					<uiflexitem
						FlexMode={Enum.UIFlexMode.Grow}
					/>
				</Text>
				<frame
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					BackgroundTransparency={0.5}
					Size={UDim2.fromScale(0.4, 1)}
				>
					<uicorner
						CornerRadius={new UDim(0, px(16))}
					/>
					<frame
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
					>
						<uicorner
							CornerRadius={new UDim(1, 0)}
						/>
						<UIListLayout
							fillDirection={Enum.FillDirection.Horizontal}
							alignY={Enum.VerticalAlignment.Center}
						/>
						<UIPadding
							padding={[px(settingsStyles.dropdown.padding), px(settingsStyles.dropdown.padding * 2)]}
						/>
						<Text
							styles={settingsStyles.dropdown.itemText}
							text={value[index]}
							alignX={Enum.TextXAlignment.Left}
							autoHeight
							autoWidth
						>
							<uiflexitem
								FlexMode={Enum.UIFlexMode.Grow}
							/>
						</Text>
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 0.4)}
						>
							<uiaspectratioconstraint
								AspectRatio={2}
							/>
							<imagelabel
								BackgroundTransparency={1}
								Image={Assets.Icons.DropdownIcon}
								Size={UDim2.fromScale(1, 1)}
								Rotation={currentDropdown === dropdownId ? 0 : 90}
							/>
						</frame>
					</frame>
					{currentDropdown === dropdownId && (
						<Button
							BackgroundColor3={Color3.fromRGB(0, 0, 0)}
							BackgroundTransparency={0.5}
							Size={UDim2.fromScale(1, 0)}
							Position={new UDim2(0, 0, 1, px(settingsStyles.dropdown.padding))}
							AutomaticSize={Enum.AutomaticSize.Y}
						>
							<uicorner
								CornerRadius={new UDim(0, px(16))}
							/>
							<UIListLayout
								fillDirection={Enum.FillDirection.Vertical}
								gap={px(settingsStyles.dropdown.padding)}
							/>
							<UIPadding
								padding={px(settingsStyles.dropdown.padding)}
							/>
							{value.map((item, i) => (
								<Item
									key={i}
									text={item}
									onClick={() => {
										onSelect(i as T);
										close();
									}}
								/>
							))}
						</Button>
					)}
				</frame>
			</frame>
		</frame>
	);
};

export default Dropdown;
