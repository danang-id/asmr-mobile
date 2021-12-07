import {ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import ProgressView from 'asmr/components/ProgressView';
import PackagingRoutes from 'asmr/screens/Packaging/PackagingRoutes';
import ScanQrCodeScreen from 'asmr/screens/Packaging/ScanQrCodeScreen';

export interface PackagingParamList extends ParamListBase {
	[PackagingRoutes.ScanQrCode]: undefined;
}
const Stack = createNativeStackNavigator<PackagingParamList>();
const PackagingNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={PackagingRoutes.ScanQrCode}
				screenOptions={{headerShown: false, headerTitle: 'Package Bean'}}>
				<Stack.Screen name={PackagingRoutes.ScanQrCode} component={ScanQrCodeScreen} />
			</Stack.Navigator>
		</ProgressView>
	);
};

export default PackagingNavigator;
