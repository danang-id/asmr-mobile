import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressView from 'asmr/components/ProgressView';
import ConfirmationScreen from 'asmr/screens/Stock/ConfirmationScreen';
import ScanQrCodeScreen from 'asmr/screens/Stock/ScanQrCodeScreen';
import StockRoutes from 'asmr/screens/Stock/StockRoutes';

export interface StockParamList extends ParamListBase {
	[StockRoutes.ScanQrCode]: undefined;
	[StockRoutes.Confirmation]: {
		beanId?: string;
	};
}
const Stack = createNativeStackNavigator<StockParamList>();

const StockNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={StockRoutes.ScanQrCode}
				screenOptions={{headerShown: false, headerTitle: 'Add Bean Stock'}}>
				<Stack.Screen name={StockRoutes.ScanQrCode} component={ScanQrCodeScreen} />
				<Stack.Screen name={StockRoutes.Confirmation} component={ConfirmationScreen} />
			</Stack.Navigator>
		</ProgressView>
	);
};

export default StockNavigator;
