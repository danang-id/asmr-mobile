import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import BeanInformationScreen from 'asmr/screens/Dashboard/BeanList/BeanInformationScreen';
import BeanListRoutes from 'asmr/screens/Dashboard/BeanList/BeanListRoutes';
import BeanListScreen from 'asmr/screens/Dashboard/BeanList/BeanListScreen';

export interface BeanListParamList extends ParamListBase {
	[BeanListRoutes.BeanListIndex]: undefined;
	[BeanListRoutes.BeanInformation]: {
		beanId?: string;
		beanName?: string;
	};
}
const Stack = createNativeStackNavigator<BeanListParamList>();

const BeanListNavigator: FC = () => {
	return (
		<Stack.Navigator initialRouteName={BeanListRoutes.BeanListIndex}>
			<Stack.Screen
				name={BeanListRoutes.BeanListIndex}
				component={BeanListScreen}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={BeanListRoutes.BeanInformation}
				component={BeanInformationScreen}
				options={({route}) => {
					const {beanName} = route.params;
					return {headerShown: true, headerTitle: beanName ?? 'Bean Information'};
				}}
			/>
		</Stack.Navigator>
	);
};

export default BeanListNavigator;
