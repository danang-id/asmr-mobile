import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import AccountRoutes from 'asmr/screens/Account/AccountRoutes';
import ProfileScreen from 'asmr/screens/Account/ProfileScreen';

export interface AccountParamList extends ParamListBase {
	[AccountRoutes.Profile]: undefined;
}
const Stack = createNativeStackNavigator<AccountParamList>();

const AccountNavigator: FC = () => {
	return (
		<Stack.Navigator initialRouteName={AccountRoutes.Profile} screenOptions={{headerShown: false}}>
			<Stack.Screen name={AccountRoutes.Profile} component={ProfileScreen} />
		</Stack.Navigator>
	);
};

export default AccountNavigator;
