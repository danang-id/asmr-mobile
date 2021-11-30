import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressView from 'asmr/components/ProgressView';
import Bean from 'asmr/core/entities/Bean';
import ConfirmGreenBeanWeightScreen from './ConfirmGreenBeanWeight';
import RoastGreenBeanRoutes from './RoastGreenBeanRoutes';
import ScanGreenBeanQrCodeScreen from './ScanGreenBeanQrCodeScreen';

export interface RoastGreenBeanParamList extends ParamListBase {
	[RoastGreenBeanRoutes.ScanGreenBeanQrCode]: undefined;
	[RoastGreenBeanRoutes.ConfirmGreenBeanWeight]: {
		bean?: Bean;
	};
}
const Stack = createNativeStackNavigator<RoastGreenBeanParamList>();

const RoastGreenBeanNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={RoastGreenBeanRoutes.ScanGreenBeanQrCode}
				screenOptions={{headerShown: false, headerTitle: 'Roast Green Bean'}}>
				<Stack.Screen name={RoastGreenBeanRoutes.ScanGreenBeanQrCode} component={ScanGreenBeanQrCodeScreen} />
				<Stack.Screen
					name={RoastGreenBeanRoutes.ConfirmGreenBeanWeight}
					component={ConfirmGreenBeanWeightScreen}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default RoastGreenBeanNavigator;
