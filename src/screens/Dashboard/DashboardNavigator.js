import React, {FC} from 'react';
import {
	createBottomTabNavigator,
	BottomTabNavigationOptions,
	BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';
import DashboardRoutes from './DashboardRoutes';
import MainScreen from './MainScreen';
import CreateScreen from './CreateScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const DashboardNavigator: FC = () => {
	function getScreenOptions({route}: BottomTabScreenProps): BottomTabNavigationOptions {
		return {
			headerShown: false,
			tabBarIcon: ({focused, color: tintColor, size: height}) => {
				if (route.name === DashboardRoutes.Create) {
					// TODO: Create custom tab bar button for Create actions
					height += 20;
					return <Icon name="add-circle" pack="ion" style={{height, tintColor}} />;
				}

				let iconName;
				if (route.name === DashboardRoutes.Main) {
					iconName = focused ? 'file-tray-full' : 'file-tray-outline';
				} else if (route.name === DashboardRoutes.Profile) {
					iconName = 'person-circle-outline';
				}

				return <Icon name={iconName} pack="ion" style={{height, tintColor}} />;
			},
			tabBarShowLabel: false,
		};
	}

	return (
		<Tab.Navigator initialRouteName={DashboardRoutes.Main} screenOptions={getScreenOptions}>
			<Tab.Screen name={DashboardRoutes.Main} component={MainScreen} />
			<Tab.Screen name={DashboardRoutes.Create} component={CreateScreen} />
			<Tab.Screen name={DashboardRoutes.Profile} component={ProfileScreen} />
		</Tab.Navigator>
	);
};

export default DashboardNavigator;
