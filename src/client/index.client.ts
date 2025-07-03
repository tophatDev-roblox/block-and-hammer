import { Logger } from 'shared/logger';

const logger = new Logger('index');
logger.print('initializing');

import './coreGuis';
import './ui';
import './ui/startScreenState';
import './ui/sideMenuState';
import './camera';
import './character';
import './area';
import './effects';
import './topbar';
import './chat';
import './leaveSound';
import './debugPanel';
import './centurion';

