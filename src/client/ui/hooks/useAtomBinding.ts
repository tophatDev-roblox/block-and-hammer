import { useBinding, useEffect } from '@rbxts/react';

import { peek, subscribe, Atom } from '@rbxts/charm';

export function useAtomBinding<T>(atom: Atom<T>): React.Binding<T> {
	const [binding, setBinding] = useBinding<T>(peek(atom));
	
	useEffect(() => {
		return subscribe(atom, (value) => {
			setBinding(value);
		});
	}, []);
	
	return binding;
}
