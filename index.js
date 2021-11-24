/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {getApplicationName} from 'react-native-device-info';
import {FileLogger as FileLogging} from 'react-native-file-logger';
import Gleap from 'react-native-gleapsdk';
import {GLEAP_TOKEN} from '@env';
import Application from './src/Application';

AppRegistry.registerComponent(getApplicationName(), () => Application);

FileLogging.configure({
	captureConsole: false,
	dailyRolling: true,
	maximumFileSize: 1024 * 1024,
	maximumNumberOfFiles: 5,
}).catch();

if (GLEAP_TOKEN) {
	Gleap.initialize(GLEAP_TOKEN);
}
