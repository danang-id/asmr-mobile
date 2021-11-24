import React, {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationProvider from '../libs/context/AuthenticationProvider';
import InventoryProvider from '../libs/context/InventoryProvider';
import ProgressProvider from '../libs/context/ProgressProvider';
import ProductionProvider from '../libs/context/ProductionProvider';

const ApplicationProvider: FC = ({children}) => (
	<SafeAreaProvider>
		<NavigationContainer>
			<ProgressProvider>
				<AuthenticationProvider>
					<InventoryProvider>
						<ProductionProvider>{children}</ProductionProvider>
					</InventoryProvider>
				</AuthenticationProvider>
			</ProgressProvider>
		</NavigationContainer>
	</SafeAreaProvider>
);

export default ApplicationProvider;
