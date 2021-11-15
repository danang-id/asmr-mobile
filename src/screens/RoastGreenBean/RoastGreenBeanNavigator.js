import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScanGreenBeanScreen from './ScanGreenBeanScreen';
import RoastGreenBeanRoutes from './RoastGreenBeanRoutes';

const Stack = createNativeStackNavigator();

const RoastGreenBeanNavigator: FC = () => {
	return (
		<Stack.Navigator
			initialRouteName={RoastGreenBeanRoutes.ScanGreenBean}
			screenOptions={{headerShown: true, headerTitle: 'Roast Green Bean'}}>
			<Stack.Screen name={RoastGreenBeanRoutes.ScanGreenBean} component={ScanGreenBeanScreen} />
		</Stack.Navigator>
	);
};

export default RoastGreenBeanNavigator;
