import { useBinding, useRef } from '@rbxts/react';
import { useMountEffect, useUnmountEffect } from '@rbxts/pretty-react-hooks';

import { peek, subscribe, Atom } from '@rbxts/charm';

export function useAtomBinding<T>(atom: Atom<T>): React.Binding<T> {
	const [value, setValue] = useBinding<T>(peek(atom));
	
	const cleanupRef = useRef<() => void>();
	
	useMountEffect(() => {
		const cleanup = subscribe(atom, (value) => {
			setValue(value);
		});
		
		cleanupRef.current = cleanup;
	});
	
	useUnmountEffect(() => {
		cleanupRef.current?.();
	});
	
	return value;
}
