import { useBinding, useEffect } from '@rbxts/react';

import { peek, subscribe, Atom } from '@rbxts/charm';

export function useAtomBinding<T>(atom: Atom<T>): React.Binding<T> {
	const [value, setValue] = useBinding<T>(peek(atom));
	
	useEffect(() => {
		return subscribe(atom, setValue);
	}, []);
	
	return value;
}
