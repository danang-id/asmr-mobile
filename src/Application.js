import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {getApplicationName, getDeviceName} from 'react-native-device-info';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider as UIKittenProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {IonIconsPack} from './components/IonIcons';
import {MaterialIconsPack} from './components/MaterialIcons';
import AuthenticationProvider from './libs/context/AuthenticationProvider';
import ProgressProvider from './libs/context/ProgressProvider';
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
	useInit(onInit);
	const applicationName = getApplicationName();
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
		logger.info(`${applicationName} is running on ${deviceName} using ${engine} engine`);
		await checkUpdate();
	}

	function onColorSchemeChanged() {
		// setTheme(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);
		setTheme(applicationLightTheme);
		logger.info(`Color scheme changed to "${colorScheme}"`);
	}

	useEffect(onColorSchemeChanged, [colorScheme]);

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<ProgressProvider>
					<AuthenticationProvider>
						<IconRegistry icons={[IonIconsPack, MaterialIconsPack]} />
						<UIKittenProvider {...eva} theme={theme}>
							<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
							<ScreenNavigator />
						</UIKittenProvider>
					</AuthenticationProvider>
				</ProgressProvider>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

export default Application;
