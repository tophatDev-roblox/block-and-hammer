import { TestingPlaceId } from 'shared/constants';

print(`[server::index] initializing as ${game.PlaceId === TestingPlaceId ? 'test' : 'live'} place`);

import './players';
import './centurion';

if (script.FindFirstChild('anticheat')) {
	require(script.FindFirstChild('anticheat') as ModuleScript);
} else {
	print('[server::index] anticheat was not found, likely because loaded from github (this is fine)');
}
