import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgressView from '../../components/ProgressView';
import ScanGreenBeanScreen from './ScanGreenBeanScreen';
import RoastGreenBeanRoutes from './RoastGreenBeanRoutes';
import BeanInformationScreen from './BeanInformationScreen';

const Stack = createNativeStackNavigator();

const RoastGreenBeanNavigator: FC = () => {
	return (
		<ProgressView>
			<Stack.Navigator
				initialRouteName={RoastGreenBeanRoutes.ScanGreenBean}
				screenOptions={{headerShown: true, headerTitle: 'Roast Green Bean'}}>
				<Stack.Screen name={RoastGreenBeanRoutes.ScanGreenBean} component={ScanGreenBeanScreen} />
				<Stack.Screen
					name={RoastGreenBeanRoutes.BeanInformation}
					component={BeanInformationScreen}
					initialParams={{bean: null}}
				/>
			</Stack.Navigator>
		</ProgressView>
	);
};

export default RoastGreenBeanNavigator;
