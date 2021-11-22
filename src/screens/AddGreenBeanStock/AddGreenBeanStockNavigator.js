import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgressView from '../../components/ProgressView';
import ScanBeanQrCodeScreen from './ScanBeanQrCodeScreen';
import ConfirmBeanWeightScreen from './ConfirmBeanWeightScreen';
import AddResultScreen from './AddResultScreen';
import AddGreenBeanStockRoutes from './AddGreenBeanStockRoutes';

const Stack = createNativeStackNavigator();

const AddGreenBeanStockNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={AddGreenBeanStockRoutes.ScanGreenBeanQrCode}
				screenOptions={{headerShown: true, headerTitle: 'Add Green Bean Stock'}}>
				<Stack.Screen name={AddGreenBeanStockRoutes.ScanGreenBeanQrCode} component={ScanBeanQrCodeScreen} />
				<Stack.Screen
					name={AddGreenBeanStockRoutes.ConfirmBeanWeightScreen}
					component={ConfirmBeanWeightScreen}
					initialParams={{bean: null}}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default AddGreenBeanStockNavigator;
