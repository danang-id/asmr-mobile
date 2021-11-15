import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgressView from '../../components/ProgressView';
import ScanIncomingGreenBeanScreen from './ScanIncomingGreenBeanScreen';
import BeanInformationScreen from './BeanInformationScreen';
import AddGreenBeanStockRoutes from './AddGreenBeanStockRoutes';

const Stack = createNativeStackNavigator();

const AddGreenBeanStockNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={AddGreenBeanStockRoutes.ScanIncomingGreenBean}
				screenOptions={{headerShown: true, headerTitle: 'Add Green Bean Stock'}}>
				<Stack.Screen
					name={AddGreenBeanStockRoutes.ScanIncomingGreenBean}
					component={ScanIncomingGreenBeanScreen}
				/>
				<Stack.Screen
					name={AddGreenBeanStockRoutes.BeanInformation}
					component={BeanInformationScreen}
					initialParams={{bean: null}}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default AddGreenBeanStockNavigator;
