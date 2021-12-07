import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressScreen from 'asmr/screens/Roasting/ProgressScreen';
import RoastingRoutes from 'asmr/screens/Roasting/RoastingRoutes';

export interface RoastingProcessParamList extends ParamListBase {
	[RoastingRoutes.Progress]: undefined;
}
const Stack = createNativeStackNavigator<RoastingProcessParamList>();

const RoastingNavigator: FC = () => {
	return (
		<Stack.Navigator
			initialRouteName={RoastingRoutes.Progress}
			screenOptions={{headerShown: false, headerTitle: 'Roasting Process'}}>
			<Stack.Screen name={RoastingRoutes.Progress} component={ProgressScreen} />
		</Stack.Navigator>
	);
};

export default RoastingNavigator;
