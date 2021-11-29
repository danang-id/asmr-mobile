import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProgressScreen from './ProgressScreen';
import RoastingProcessRoutes from './RoastingProcessRoutes';

const Stack = createNativeStackNavigator();

const RoastingProcessNavigator: FC = () => {
	return (
		<Stack.Navigator
			initialRouteName={RoastingProcessRoutes.Progress}
			screenOptions={{headerShown: false, headerTitle: 'Roasting Process'}}>
			<Stack.Screen name={RoastingProcessRoutes.Progress} component={ProgressScreen} />
		</Stack.Navigator>
	);
};

export default RoastingProcessNavigator;
