import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressView from 'asmr/components/ProgressView';
import Bean from 'asmr/core/entities/Bean';
import AddGreenBeanStockRoutes from './AddGreenBeanStockRoutes';
import ConfirmBeanWeightScreen from './ConfirmBeanWeightScreen';
import ScanBeanQrCodeScreen from './ScanBeanQrCodeScreen';

export interface AddGreenBeanStockParamList extends ParamListBase {
	[AddGreenBeanStockRoutes.ScanGreenBeanQrCode]: undefined;
	[AddGreenBeanStockRoutes.ConfirmBeanWeightScreen]: {
		bean?: Bean;
	};
}
const Stack = createNativeStackNavigator<AddGreenBeanStockParamList>();

const AddGreenBeanStockNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={AddGreenBeanStockRoutes.ScanGreenBeanQrCode}
				screenOptions={{headerShown: false, headerTitle: 'Add Green Bean Stock'}}>
				<Stack.Screen name={AddGreenBeanStockRoutes.ScanGreenBeanQrCode} component={ScanBeanQrCodeScreen} />
				<Stack.Screen
					name={AddGreenBeanStockRoutes.ConfirmBeanWeightScreen}
					component={ConfirmBeanWeightScreen}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default AddGreenBeanStockNavigator;
