import { atom } from '@rbxts/charm';

import { String } from 'shared/string';

export namespace LocationState {
	export type Path =
		| '/start-screen'
		| '/game'
		| '/game/side-menu'
		| '/game/side-menu/:panel'
		| '/game/side-menu/settings';
	
	export const pathAtom = atom<Path>('/start-screen', {
		equals: (_previousValue, value) => value.match('^/[a-zA-Z-/]*[a-zA-Z]$')[0] === undefined,
	});
	
	type RouteParamsKey<Path extends string> =
		Path extends `${string}:${infer Param}/${infer Rest}`
			? Param | RouteParamsKey<`/${Rest}`>
			: Path extends `${string}:${infer Param}`
			? Param
			: never;
	
	type RouteParams<Path extends string> = ReadonlyMap<RouteParamsKey<Path>, string>;
	
	export function segments(path: string): ReadonlyArray<string> {
		return path.split('/');
	}
	
	export function navigate(to: Path): void {
		pathAtom(to);
	}
	
	export function isAt(path: Path, current: Path): boolean {
		return String.startsWith(path, current);
	}
	
	export function match<T extends Path>(match: T, path: Path): RouteParams<T> | undefined {
		const params = new Map<string, string>();
		
		const pathSegments = segments(path);
		const matchSegments = segments(match);
		if (pathSegments.size() < matchSegments.size()) {
			return undefined;
		}
		
		for (const [i, segment] of pairs(pathSegments)) {
			const value = matchSegments[i - 1];
			if (String.startsWith(':', value)) {
				params.set(value.sub(2), segment);
			} else {
				if (segment !== value) {
					return undefined;
				}
			}
		}
		
		return params as any as RouteParams<T>;
	}
}
