import { useBinding, useEffect } from '@rbxts/react';
import Charm, { peek, subscribe } from '@rbxts/charm';

export function useAtomBinding<T>(atom: Charm.Atom<T>): React.Binding<T> {
	const [binding, setBinding] = useBinding<T>(peek(atom));
	
	useEffect(() => {
		return subscribe(atom, (value) => {
			setBinding(value);
		});
	}, []);
	
	return binding;
}
