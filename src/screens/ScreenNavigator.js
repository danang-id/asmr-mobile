import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import useAuthentication from '../libs/hooks/AuthenticationHook';
import useInit from '../libs/hooks/InitHook';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';
import DashboardNavigator from './Dashboard/DashboardNavigator';
import IncomingGreenBeanNavigator from './IncomingGreenBean/IncomingGreenBeanNavigator';
import RoastGreenBeanNavigator from './RoastGreenBean/RoastGreenBeanNavigator';
import ScreenRoutes from './ScreenRoutes';

const Stack = createNativeStackNavigator();

const ScreenNavigator: FC = () => {
	useInit(onInit);
	const authentication = useAuthentication();

	async function onInit() {
		await authentication.updateUserData();
		SplashScreen.hide();
	}

	if (!authentication.isAuthenticated()) {
		return <AuthenticationNavigator />;
	}

	return (
		<Stack.Navigator initialRouteName={ScreenRoutes.Dashboard} screenOptions={{headerShown: false}}>
			<Stack.Screen name={ScreenRoutes.Dashboard} component={DashboardNavigator} />
			<Stack.Screen name={ScreenRoutes.IncomingGreenBean} component={IncomingGreenBeanNavigator} />
			<Stack.Screen name={ScreenRoutes.RoastGreenBean} component={RoastGreenBeanNavigator} />
		</Stack.Navigator>
	);
};

export default ScreenNavigator;
