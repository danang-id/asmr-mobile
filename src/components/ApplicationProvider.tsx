import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from 'react-query';
import AuthenticationProvider from 'asmr/context/AuthenticationProvider';
import BeanProvider from 'asmr/context/BeanProvider';
import InventoryProvider from 'asmr/context/InventoryProvider';
import ProductionProvider from 'asmr/context/ProductionProvider';
import ProgressProvider from 'asmr/context/ProgressProvider';

const queryClient = new QueryClient();

const ApplicationProvider: FC = ({children}) => (
	<SafeAreaProvider>
		<NavigationContainer>
			<QueryClientProvider client={queryClient}>
				<ProgressProvider>
					<AuthenticationProvider>
						<BeanProvider>
							<InventoryProvider>
								<ProductionProvider>{children}</ProductionProvider>
							</InventoryProvider>
						</BeanProvider>
					</AuthenticationProvider>
				</ProgressProvider>
			</QueryClientProvider>
		</NavigationContainer>
	</SafeAreaProvider>
);

export default ApplicationProvider;
