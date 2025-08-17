import { Constants } from 'shared/constants';
import { Logger } from 'shared/logger';

const logger = new Logger('index');
logger.print(`initializing as ${game.PlaceId === Constants.TestingPlaceId ? 'test' : 'live'} place`);

import './players';
import './centurion';
