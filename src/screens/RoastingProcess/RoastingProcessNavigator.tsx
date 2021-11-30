import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';

import ProgressScreen from './ProgressScreen';
import RoastingProcessRoutes from './RoastingProcessRoutes';

export interface RoastingProcessParamList extends ParamListBase {
	[RoastingProcessRoutes.Progress]: undefined;
}
const Stack = createNativeStackNavigator<RoastingProcessParamList>();

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
