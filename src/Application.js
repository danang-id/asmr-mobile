import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {getApplicationName, getBuildNumber, getDeviceName, getVersion} from 'react-native-device-info';
import {ApplicationProvider as UIKittenProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Gleap from 'react-native-gleapsdk';
import {GLEAP_TOKEN} from '@env';
import ApplicationProvider from './components/ApplicationProvider';
import {IonIconsPack} from './components/IonIcons';
import {MaterialIconsPack} from './components/MaterialIcons';
import useInit from './libs/hooks/InitHook';
import useLogger from './libs/hooks/LoggerHook';
import useUpdateChecker from './libs/hooks/UpdateChecker';
import ScreenNavigator from './screens/ScreenNavigator';
import {applicationLightTheme} from './styles/theme';

const isHermes = () => !!global.HermesInternal;
const isV8 = () => !!global._v8runtime;

/*
 * TODO: Dark mode does not work very well with our current theming,
 *		 so we will use both light theme on both color scheme.
 * */
const Application: () => Node = () => {
	const applicationName = getApplicationName();
	const buildNumber = getBuildNumber();
	const version = getVersion();

	useInit(onInit);
	const checkUpdate = useUpdateChecker();
	const colorScheme = useColorScheme();
	const logger = useLogger(Application);
	// TODO: Fix dark mode
	// const [theme, setTheme] = useState(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);
	const [theme, setTheme] = useState(applicationLightTheme);

	async function onInit() {
		let engine = 'JavaScriptCore';
		if (isHermes()) {
			engine = 'Hermes';
		} else if (isV8()) {
			engine = 'V8';
		}
		const deviceName = await getDeviceName();
		logger.info(`${applicationName} v${version}-${buildNumber} is running on ${deviceName} using ${engine} engine`);

		if (GLEAP_TOKEN) {
			logger.info('Gleap SDK initialized');
		}

		await checkUpdate();
	}

	function onColorSchemeChanged() {
		// setTheme(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);
		setTheme(applicationLightTheme);
		logger.info(`Color scheme changed to "${colorScheme}"`);

		if (GLEAP_TOKEN) {
			Gleap.setCustomData('Color scheme', colorScheme);
		}
	}

	useEffect(onColorSchemeChanged, [colorScheme]);

	return (
		<ApplicationProvider>
			<IconRegistry icons={[IonIconsPack, MaterialIconsPack]} />
			<UIKittenProvider {...eva} theme={theme}>
				<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
				<ScreenNavigator />
			</UIKittenProvider>
		</ApplicationProvider>
	);
};

export default Application;
