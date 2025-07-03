import { Logger } from 'shared/logger';
import { TestingPlaceId } from 'shared/constants';

const logger = new Logger('index');
logger.print(`initializing as ${game.PlaceId === TestingPlaceId ? 'test' : 'live'} place`);

import './players';
import './centurion';

if (script.FindFirstChild('anticheat')) {
	require(script.FindFirstChild('anticheat') as ModuleScript);
}
