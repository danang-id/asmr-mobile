import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC, Fragment, useEffect, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/authentication.hook';
import AccountNavigator from 'asmr/screens/Account';
import AuthenticationNavigator from 'asmr/screens/Authentication';
import DashboardNavigator from 'asmr/screens/Dashboard';
import PackagingNavigator from 'asmr/screens/Packaging';
import RoastNavigator from 'asmr/screens/Roast';
import RoastingNavigator from 'asmr/screens/Roasting';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import StockNavigator from 'asmr/screens/Stock';

export interface RootParamList extends ParamListBase {
	[ScreenRoutes.Dashboard]: undefined;
	[ScreenRoutes.Account]: undefined;
	[ScreenRoutes.Stock]: undefined;
	[ScreenRoutes.Roast]: undefined;
	[ScreenRoutes.Roasting]: undefined;
	[ScreenRoutes.Packaging]: undefined;
}
const Stack = createNativeStackNavigator<RootParamList>();

const ScreenNavigator: FC = () => {
	const {isAuthenticated, isAuthorized, isUserLoading, user} = useAuthentication();
	const initialized = useRef<boolean>(false);

	function onUserValidatingChanged() {
		if (!isUserLoading && !initialized.current) {
			SplashScreen.hide();
			initialized.current = true;
		}
	}

	useEffect(onUserValidatingChanged, [isUserLoading]);

	if (!isAuthenticated || !user) {
		return <AuthenticationNavigator />;
	}

	return (
		<Stack.Navigator initialRouteName={ScreenRoutes.Dashboard} screenOptions={{headerShown: false}}>
			<Stack.Screen name={ScreenRoutes.Dashboard} component={DashboardNavigator} />
			<Stack.Screen name={ScreenRoutes.Account} component={AccountNavigator} />
			{isAuthorized([Role.Roaster]) && (
				<Fragment>
					<Stack.Screen name={ScreenRoutes.Stock} component={StockNavigator} />
					<Stack.Screen name={ScreenRoutes.Roast} component={RoastNavigator} />
					<Stack.Screen name={ScreenRoutes.Roasting} component={RoastingNavigator} />
					<Stack.Screen name={ScreenRoutes.Packaging} component={PackagingNavigator} />
				</Fragment>
			)}
		</Stack.Navigator>
	);
};

export default ScreenNavigator;
