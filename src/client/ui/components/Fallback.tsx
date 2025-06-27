import React, { Error, useEffect } from '@rbxts/react';
import { useAtom } from '@rbxts/react-charm';

import { usePx } from '../hooks/usePx';
import { forcePauseGameplayAtom } from 'client/character/atoms';
import { refreshCallbackAtom } from './ErrorBoundary';
import { Remotes } from 'shared/events';

interface FallbackProps {
	err: Error;
}

const Fallback: React.FC<FallbackProps> = ({ err }) => {
	const refreshCallback = useAtom(refreshCallbackAtom);
	
	const px = usePx();
	
	useEffect(() => {
		warn(`[client::ui/App] ${'='.rep(60)}`);
		warn(`[client::ui/App] > please report this as a bug in the discord server`);
		warn(`[client::ui/App] error: ${err.message}`)
		warn(`[client::ui/App] stack:\n${err.stack || '<n/a>'}`);
		warn(`[client::ui/App] ${'='.rep(60)}`);
		
		forcePauseGameplayAtom(true);
		
		return () => {
			forcePauseGameplayAtom(false);
		};
	}, []);
	
	return (
		<screengui
			DisplayOrder={100}
			ResetOnSpawn={false}
		>
			<textlabel
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.3}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				Position={new UDim2(0, 0, 1, 0)}
				AnchorPoint={new Vector2(0, 1)}
				TextSize={px(60)}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Color3.fromRGB(255, 150, 150)}
				Text={`uh oh, an error occured! <font size="${px(35)}">check console for the full stack</font>\nerror: <b>${err.message}</b>`}
				FontFace={new Font('rbxassetid://12187365364', Enum.FontWeight.Regular, Enum.FontStyle.Normal)}
				TextWrapped
				RichText
			>
				<uipadding
					PaddingTop={new UDim(0, px(8))}
					PaddingRight={new UDim(0, px(8))}
					PaddingBottom={new UDim(0, px(8))}
					PaddingLeft={new UDim(0, px(8))}
				/>
				{refreshCallback !== undefined && (
					<>
						<textbutton
							BackgroundColor3={Color3.fromRGB(200, 0, 0)}
							BackgroundTransparency={0.6}
							BorderSizePixel={0}
							Size={new UDim2(0, 0, 0, 0)}
							AutomaticSize={Enum.AutomaticSize.XY}
							Position={new UDim2(1, 0, 0, -8)}
							AnchorPoint={new Vector2(1, 1)}
							TextSize={px(60)}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Text={'attempt to refresh ui'}
							FontFace={new Font('rbxassetid://12187365364', Enum.FontWeight.Heavy, Enum.FontStyle.Normal)}
							TextWrapped={false}
							Event={{
								MouseButton1Click: () => {
									refreshCallback.refresh();
								},
							}}
						>
							<uipadding
								PaddingTop={new UDim(0, px(8))}
								PaddingRight={new UDim(0, px(8))}
								PaddingBottom={new UDim(0, px(8))}
								PaddingLeft={new UDim(0, px(8))}
							/>
						</textbutton>
						<textbutton
							BackgroundColor3={Color3.fromRGB(200, 0, 0)}
							BackgroundTransparency={0.6}
							BorderSizePixel={0}
							Size={new UDim2(0, 0, 0, 0)}
							AutomaticSize={Enum.AutomaticSize.XY}
							Position={new UDim2(0, 0, 0, -8)}
							AnchorPoint={new Vector2(0, 1)}
							TextSize={px(60)}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Text={'attempt to refresh ui and reset cube'}
							FontFace={new Font('rbxassetid://12187365364', Enum.FontWeight.Heavy, Enum.FontStyle.Normal)}
							TextWrapped={false}
							Event={{
								MouseButton1Click: () => {
									Remotes.fullReset.fire();
									task.wait(0.5);
									refreshCallback.refresh();
								},
							}}
						>
							<uipadding
								PaddingTop={new UDim(0, px(8))}
								PaddingRight={new UDim(0, px(8))}
								PaddingBottom={new UDim(0, px(8))}
								PaddingLeft={new UDim(0, px(8))}
							/>
						</textbutton>
					</>
				)}
			</textlabel>
		</screengui>
	);
};

export default Fallback;
