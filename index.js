/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import {GLEAP_TOKEN} from '@env';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import id from 'javascript-time-ago/locale/id.json';
import {AppRegistry} from 'react-native';
import {getApplicationName} from 'react-native-device-info';
import {FileLogger as FileLogging} from 'react-native-file-logger';
import Gleap from 'react-native-gleapsdk';
import Application from 'asmr/Application';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(id);

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
