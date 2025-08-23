import { createContext, useContext } from '@rbxts/react';

import { Logger } from 'shared/logger';

const logger = new Logger('ui', 'contexts', 'dropdown');

export const DropdownContext = createContext<{
	currentDropdown?: string;
	open: (id: string) => void;
	close: () => void;
} | undefined>(undefined);

export const useDropdownContext = () => {
	const context = useContext(DropdownContext);
	
	if (context === undefined) {
		throw logger.format('useDropdownContext() must be used in <DropdownContext.Provider />');
	}
	
	return context;
};
