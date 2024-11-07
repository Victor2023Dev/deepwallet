import './src/background/background';

import {Keplr} from '@keplr-wallet/provider';
import {RNMessageRequesterInternal} from './src/router';

// @ts-ignore
window.deepwallet = new Keplr('', 'core', new RNMessageRequesterInternal());
