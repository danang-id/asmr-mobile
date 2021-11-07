import React, {FC} from 'react';
import {
	createBottomTabNavigator,
	BottomTabNavigationOptions,
	BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import DashboardRoutes from './DashboardRoutes';
import HomeScreen from './MainScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

type DashboardNavigatorProps = BottomTabScreenProps<{}>;
const DashboardNavigator: FC<DashboardNavigatorProps> = () => {
	function getScreenOptions({route}: DashboardNavigatorProps): BottomTabNavigationOptions {
		return {
			headerShown: false,
			tabBarIcon: ({focused, color, size}) => {
				let iconName;

				if (route.name === DashboardRoutes.Home) {
					iconName = focused ? 'file-tray-full' : 'file-tray-outline';
				} else if (route.name === DashboardRoutes.Profile) {
					iconName = 'person-circle-outline';
				}

				return <Icon name={iconName} size={size} color={color} />;
			},
			tabBarShowLabel: false,
		};
	}

	return (
		<Tab.Navigator initialRouteName={DashboardRoutes.Home} screenOptions={getScreenOptions}>
			<Tab.Screen name={DashboardRoutes.Home} component={HomeScreen} />
			<Tab.Screen name={DashboardRoutes.Profile} component={ProfileScreen} />
		</Tab.Navigator>
	);
};

export default DashboardNavigator;
