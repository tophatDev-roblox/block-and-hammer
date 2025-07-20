import { atom, peek } from '@rbxts/charm';

import { String } from 'shared/string';

export namespace LocationState {
	export type Path =
		| '/start-screen'
		| '/game'
		| '/game/side-menu';
	
	export const pathAtom = atom<Path>('/start-screen');
	
	type RouteParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
		? { [k in Param | keyof RouteParams<`/${Rest}`>]: string } : Path extends `${string}:${infer Param}`
		? { [k in Param]: string } : {};
	
	export function segments(path: string): ReadonlyArray<string> {
		return path.split('/');
	}
	
	export function navigate(to: Path): void {
		pathAtom(to);
	}
	
	export function isAt(path: Path, current: Path): boolean {
		return String.startsWith(path, current);
	}
	
	export function match<T extends Path>(match: T): RouteParams<T> | undefined {
		const params = {} as any;
		const path = peek(pathAtom);
		
		const pathSegments = segments(path);
		const matchSegments = segments(match);
		if (pathSegments.size() < matchSegments.size()) {
			return undefined;
		}
		
		for (const i of $range(0, matchSegments.size() - 1)) {
			const segment = pathSegments[i];
			
			const value = matchSegments[i];
			if (String.startsWith(':', value)) {
				params[value.sub(2)] = segment;
			} else {
				if (segment !== value) {
					return undefined;
				}
			}
		}
		
		return params;
	}
}
