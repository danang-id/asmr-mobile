import React, {FC, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import useAuthentication from '../libs/hooks/AuthenticationHook';
import useInit from '../libs/hooks/InitHook';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';
import DashboardNavigator from './Dashboard/DashboardNavigator';
import AddGreenBeanStockNavigator from './AddGreenBeanStock/AddGreenBeanStockNavigator';
import RoastGreenBeanNavigator from './RoastGreenBean/RoastGreenBeanNavigator';
import ScreenRoutes from './ScreenRoutes';
import Role from '../core/enums/Role';

const Stack = createNativeStackNavigator();

const ScreenNavigator: FC = () => {
	useInit(onInit);
	const {user, isAuthenticated, isAuthorized, updateUserData} = useAuthentication();

	const [isRoaster, setIsRoaster] = useState(false);

	async function onInit() {
		await updateUserData();
		SplashScreen.hide();
	}

	function onUserDataChanged() {
		if (isAuthenticated()) {
			setIsRoaster(isAuthorized([Role.Roaster]));
		} else {
			setIsRoaster(false);
		}
	}

	useEffect(onUserDataChanged, [user]);

	if (!isAuthenticated()) {
		return <AuthenticationNavigator />;
	}

	return (
		<Stack.Navigator initialRouteName={ScreenRoutes.Dashboard} screenOptions={{headerShown: false}}>
			<Stack.Screen name={ScreenRoutes.Dashboard} component={DashboardNavigator} />
			{isRoaster && (
				<>
					<Stack.Screen name={ScreenRoutes.AddGreenBeanStock} component={AddGreenBeanStockNavigator} />
					<Stack.Screen name={ScreenRoutes.RoastGreenBean} component={RoastGreenBeanNavigator} />
				</>
			)}
		</Stack.Navigator>
	);
};

export default ScreenNavigator;
