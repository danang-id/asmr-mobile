import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgressView from '../../components/ProgressView';
import ScanGreenBeanQrCodeScreen from './ScanGreenBeanQrCodeScreen';
import RoastGreenBeanRoutes from './RoastGreenBeanRoutes';
import ConfirmGreenBeanWeightScreen from './ConfirmGreenBeanWeight';

const Stack = createNativeStackNavigator();

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
					initialParams={{bean: null}}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default RoastGreenBeanNavigator;
