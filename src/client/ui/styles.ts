import { atom } from '@rbxts/charm';

import { Styles } from 'client/stylesParser';
import defaultStyles from 'client/stylesParser/default';

export const stylesAtom = atom<Styles.Data>(defaultStyles);
