import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthenticationProvider from 'asmr/context/AuthenticationProvider';
import InventoryProvider from 'asmr/context/InventoryProvider';
import ProductionProvider from 'asmr/context/ProductionProvider';
import ProgressProvider from 'asmr/context/ProgressProvider';

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
