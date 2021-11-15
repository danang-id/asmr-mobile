import React, {FC, useEffect, useState} from 'react';
import {
	createBottomTabNavigator,
	BottomTabNavigationOptions,
	BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';
import Role from '../../core/enums/Role';
import useAuthentication from '../../libs/hooks/AuthenticationHook';
import MainScreen from './MainScreen';
import CreateScreen from './CreateScreen';
import ProfileScreen from './ProfileScreen';
import DashboardRoutes from './DashboardRoutes';

const Tab = createBottomTabNavigator();

const DashboardNavigator: FC = () => {
	const {user, isAuthorized} = useAuthentication();
	const [isRoaster, setIsRoaster] = useState(false);

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

	function onUserDataChanged() {
		setIsRoaster(isAuthorized([Role.Roaster]));
	}

	useEffect(onUserDataChanged, [user]);

	return (
		<Tab.Navigator initialRouteName={DashboardRoutes.Main} screenOptions={getScreenOptions}>
			<Tab.Screen name={DashboardRoutes.Main} component={MainScreen} />
			{isRoaster && <Tab.Screen name={DashboardRoutes.Create} component={CreateScreen} />}
			<Tab.Screen name={DashboardRoutes.Profile} component={ProfileScreen} />
		</Tab.Navigator>
	);
};

export default DashboardNavigator;
