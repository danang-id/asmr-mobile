import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC, Fragment, useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/AuthenticationHook';
import {useInitAsync} from 'asmr/hooks/InitHook';
import AddGreenBeanStockNavigator from 'asmr/screens/AddGreenBeanStock/AddGreenBeanStockNavigator';
import AuthenticationNavigator from 'asmr/screens/Authentication/AuthenticationNavigator';
import DashboardNavigator from 'asmr/screens/Dashboard/DashboardNavigator';
import RoastGreenBeanNavigator from 'asmr/screens/RoastGreenBean/RoastGreenBeanNavigator';
import RoastingProcessNavigator from 'asmr/screens/RoastingProcess/RoastingProcessNavigator';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';

const Stack = createNativeStackNavigator();

const ScreenNavigator: FC = () => {
	useInitAsync(onInitAsync);
	const {user, isAuthenticated, isAuthorized, refresh: refreshAuthentication} = useAuthentication();

	const [isRoaster, setIsRoaster] = useState(false);

	async function onInitAsync(): Promise<void> {
		await refreshAuthentication();
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
				<Fragment>
					<Stack.Screen name={ScreenRoutes.AddGreenBeanStock} component={AddGreenBeanStockNavigator} />
					<Stack.Screen name={ScreenRoutes.RoastGreenBean} component={RoastGreenBeanNavigator} />
					<Stack.Screen name={ScreenRoutes.RoastingProcess} component={RoastingProcessNavigator} />
				</Fragment>
			)}
		</Stack.Navigator>
	);
};

export default ScreenNavigator;
