import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import ApplicationProvider from './components/ApplicationProvider';
import useInit from './libs/hooks/InitHook';
import useLogger from './libs/hooks/LoggerHook';
import RootNavigator from './screens/RootNavigator';
import {name as appName} from '../app.json';

const isHermes = () => !!global.HermesInternal;

const Application: () => Node = () => {
	useInit(onInit);
	const logger = useLogger(Application);

	async function onInit() {
		const deviceName = await DeviceInfo.getDeviceName();

		let engine = 'JavaScriptCore';
		if (isHermes()) {
			engine = 'Hermes';
		}

		logger.info(`${appName} is running on ${deviceName} using ${engine} engine`);
	}

	return (
		<ApplicationProvider>
			<NavigationContainer>
				<RootNavigator />
			</NavigationContainer>
		</ApplicationProvider>
	);
};

export default Application;
