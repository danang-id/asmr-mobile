/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {getApplicationName} from 'react-native-device-info';
import Application from './src/Application';

AppRegistry.registerComponent(getApplicationName(), () => Application);
