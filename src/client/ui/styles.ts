import { atom } from '@rbxts/charm';
import { StylesData } from 'client/stylesParser';
import defaultStyles from 'client/stylesParser/default';

export const stylesAtom = atom<StylesData>(defaultStyles);
