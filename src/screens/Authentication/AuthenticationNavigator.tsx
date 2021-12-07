import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import AuthenticationRoutes from 'asmr/screens/Authentication/AuthenticationRoutes';
import SignInScreen from 'asmr/screens/Authentication/SignInScreen';

const Stack = createNativeStackNavigator();
const screenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	orientation: 'portrait',
};

const AuthenticationNavigator: FC = () => (
	<Stack.Navigator initialRouteName={AuthenticationRoutes.SignIn} screenOptions={screenOptions}>
		<Stack.Screen name={AuthenticationRoutes.SignIn} component={SignInScreen} />
	</Stack.Navigator>
);

export default AuthenticationNavigator;
