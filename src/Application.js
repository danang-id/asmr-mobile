import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {getDeviceName} from 'react-native-device-info';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider as UIKittenProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import useInit from './libs/hooks/InitHook';
import useLogger from './libs/hooks/LoggerHook';
import ScreenNavigator from './screens/ScreenNavigator';
import {name as appName} from '../app.json';
import AuthenticationProvider from './libs/context/AuthenticationProvider';
import {applicationLightTheme, applicationDarkTheme} from './styles/theme';
import {IonIconsPack} from './components/IonIcons';
import {MaterialIconsPack} from './components/MaterialIcons';
import {SafeAreaProvider} from 'react-native-safe-area-context/src/SafeAreaContext';

const isHermes = () => !!global.HermesInternal;

/*
 * TODO: Dark mode does not work very well with our current theming,
 *		 so we will use both light theme on both color scheme.
 * */
const Application: () => Node = () => {
	useInit(onInit);
	const colorScheme = useColorScheme();
	const logger = useLogger(Application);
	const [theme, setTheme] = useState(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);

	useEffect(() => {
		setTheme(colorScheme === 'dark' ? applicationDarkTheme : applicationLightTheme);
		logger.info(`Color scheme changed to "${colorScheme}"`);
	}, [colorScheme]);

	async function onInit() {
		const engine = isHermes() ? 'Hermes' : 'JavaScriptCore';
		const deviceName = await getDeviceName();
		logger.info(`${appName} is running on ${deviceName} using ${engine} engine`);
	}

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<AuthenticationProvider>
					<IconRegistry icons={[IonIconsPack, MaterialIconsPack]} />
					<UIKittenProvider {...eva} theme={theme}>
						<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
						<ScreenNavigator />
					</UIKittenProvider>
				</AuthenticationProvider>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

export default Application;
