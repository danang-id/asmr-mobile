import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {name as appName} from '../app.json';
import {withProvider} from './components/ApplicationProvider';
import useInit from './libs/hooks/InitHook';
import useLogger from './libs/hooks/LoggerHook';
import RootNavigator from './screens/RootNavigator';

const isHermes = () => !!global.HermesInternal;

const Application: () => Node = () => {
	useInit(onInit);
	const logger = useLogger(Application);

	async function onInit() {
		let engine = 'JavaScriptCore';
		if (isHermes()) {
			engine = 'Hermes';
		}

		logger.info(`${appName} is running using ${engine} engine`);
	}

	return (
		<NavigationContainer>
			<RootNavigator />
		</NavigationContainer>
	);
};

export default withProvider(Application);
