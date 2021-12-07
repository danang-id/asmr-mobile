import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressView from 'asmr/components/ProgressView';
import ConfirmationScreen from 'asmr/screens/Roast/ConfirmationScreen';
import RoastRoutes from 'asmr/screens/Roast/RoastRoutes';
import ScanQrCodeScreen from 'asmr/screens/Roast/ScanQrCodeScreen';

export interface RoastParamList extends ParamListBase {
	[RoastRoutes.ScanQrCode]: undefined;
	[RoastRoutes.Confirmation]: {
		beanId?: string;
	};
}
const Stack = createNativeStackNavigator<RoastParamList>();

const RoastNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={RoastRoutes.ScanQrCode}
				screenOptions={{headerShown: false, headerTitle: 'Roast Bean'}}>
				<Stack.Screen name={RoastRoutes.ScanQrCode} component={ScanQrCodeScreen} />
				<Stack.Screen name={RoastRoutes.Confirmation} component={ConfirmationScreen} />
			</Stack.Navigator>
		</ProgressView>
	);
};

export default RoastNavigator;
