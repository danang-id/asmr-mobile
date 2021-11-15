import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScanIncomingGreenBeanScreen from './ScanIncomingGreenBeanScreen';
import IncomingGreenBeanRoutes from './IncomingGreenBeanRoutes';

const Stack = createNativeStackNavigator();

const IncomingGreenBeanNavigator: FC = () => {
	return (
		<Stack.Navigator
			initialRouteName={IncomingGreenBeanRoutes.ScanIncomingGreenBean}
			screenOptions={{headerShown: true, headerTitle: 'Incoming Green Bean'}}>
			<Stack.Screen
				name={IncomingGreenBeanRoutes.ScanIncomingGreenBean}
				component={ScanIncomingGreenBeanScreen}
			/>
		</Stack.Navigator>
	);
};

export default IncomingGreenBeanNavigator;
