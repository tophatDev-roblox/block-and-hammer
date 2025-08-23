import { createContext, useContext } from '@rbxts/react';

import Ripple from '@rbxts/ripple';

import { Logger } from 'shared/logger';

const logger = new Logger('ui', 'contexts', 'scrolling-items');

export interface ItemRegistry {
	frame: Frame;
	paddingMotion: Ripple.Motion<UDim>;
}

export const ItemsContext = createContext<{
	register: (item: ItemRegistry) => void;
	unregister: (frame: Frame) => void;
} | undefined>(undefined);

export const useItemsContext = () => {
	const context = useContext(ItemsContext);
	
	if (context === undefined) {
		throw logger.format('useItemsContext() must be used in <ItemsContext.Provider />');
	}
	
	return context;
};
