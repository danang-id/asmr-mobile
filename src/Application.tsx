import {GLEAP_TOKEN} from '@env';
import * as eva from '@eva-design/eva';
import {ApplicationProvider as UIKittenProvider, IconRegistry} from '@ui-kitten/components';
import React, {ReactElement, useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {getApplicationName, getBuildNumber, getDeviceName, getVersion} from 'react-native-device-info';
import Gleap from 'react-native-gleapsdk';
import ApplicationProvider from 'asmr/components/ApplicationProvider';
import {IonIconsPack} from 'asmr/components/IonIcons';
import {MaterialIconsPack} from 'asmr/components/MaterialIcons';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useUpdateChecker from 'asmr/hooks/UpdateChecker';
import ScreenNavigator from 'asmr/screens/ScreenNavigator';
import {applicationLightTheme} from 'asmr/styles/theme';

const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null;
const usingV8 = !!_v8runtime;
/*
 * TODO: Dark mode does not work very well with our current theming,
 *		 so we will use both light theme on both color scheme.
 * */
const Application: () => ReactElement = () => {
	const applicationName = getApplicationName();
	const buildNumber = getBuildNumber();
	const version = getVersion();

	useInitAsync(onInitAsync);
	const checkUpdate = useUpdateChecker();
	const colorScheme = useColorScheme();
	const logger = useLogger(Application);
	// TODO: Fix dark mode
	// const [theme, setTheme] = useState(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);
	const [theme, setTheme] = useState(applicationLightTheme);

	async function onInitAsync(): Promise<void> {
		let engine = 'JavaScriptCore';
		if (usingHermes) {
			engine = 'Hermes';
		} else if (usingV8) {
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
			Gleap.setCustomData('Color scheme', colorScheme as string);
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
