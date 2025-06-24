import React, { createContext, useContext } from '@rbxts/react';

import defaultStyles from 'client/stylesParser/default';
import { StylesData } from 'client/stylesParser';

interface StylesContextValue {
	styles: StylesData;
}

export const StylesContext = createContext<StylesContextValue | undefined>(undefined);

export function useStylesContext(): StylesContextValue {
	const context = useContext(StylesContext);
	if (!context) {
		throw '[client::providers/styles] useStylesContext must be used within a StylesProvider';
	}
	
	return context;
}

interface StylesProviderProps {
	children: React.ReactNode;
}

const StylesProvider: React.FC<StylesProviderProps> = ({ children }) => {
	return (
		<StylesContext.Provider
			value={{
				styles: defaultStyles,
			}}
		>
			{children}
		</StylesContext.Provider>
	);
};

export default StylesProvider;
