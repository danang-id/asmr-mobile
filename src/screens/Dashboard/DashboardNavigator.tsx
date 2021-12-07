import {createBottomTabNavigator, BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {Icon} from '@ui-kitten/components';
import React, {FC} from 'react';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/authentication.hook';
import BeanListNavigator from 'asmr/screens/Dashboard/BeanList';
import CreateScreen from 'asmr/screens/Dashboard/CreateScreen';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import HomeScreen from 'asmr/screens/Dashboard/HomeScreen';
import applicationColors from 'asmr/styles/colors';

export interface DashboardParamList extends ParamListBase {
	[DashboardRoutes.Home]: undefined;
	[DashboardRoutes.Create]: undefined;
	[DashboardRoutes.BeanList]: undefined;
}
const Tab = createBottomTabNavigator<DashboardParamList>();

const DashboardNavigator: FC = () => {
	const {isAuthorized} = useAuthentication();

	type GetScreenOptionsProps = {route: RouteProp<DashboardParamList>; navigation: unknown};
	function getScreenOptions({route}: GetScreenOptionsProps): BottomTabNavigationOptions {
		return {
			headerShown: false,
			tabBarIcon: ({focused, color: tintColor, size: height}) => {
				let iconName;
				let iconPack;
				if (route.name === DashboardRoutes.Home) {
					iconName = 'home';
					iconPack = 'material';
				} else if (route.name === DashboardRoutes.Create) {
					height += 20;
					iconName = focused ? 'add-circle' : 'add-circle-outline';
					iconPack = 'ion';
				} else if (route.name === DashboardRoutes.BeanList) {
					iconName = focused ? 'list' : 'list-outline';
					iconPack = 'ion';
				}

				tintColor = focused ? applicationColors.bean : applicationColors.darker;

				return <Icon name={iconName} pack={iconPack} style={{height, tintColor}} />;
			},
			tabBarShowLabel: false,
		};
	}

	return (
		<Tab.Navigator initialRouteName={DashboardRoutes.Home} screenOptions={getScreenOptions}>
			<Tab.Screen name={DashboardRoutes.Home} component={HomeScreen} />
			{isAuthorized([Role.Roaster]) && <Tab.Screen name={DashboardRoutes.Create} component={CreateScreen} />}
			<Tab.Screen name={DashboardRoutes.BeanList} component={BeanListNavigator} />
		</Tab.Navigator>
	);
};

export default DashboardNavigator;
