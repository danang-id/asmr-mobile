import React, {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthenticationProvider from '../libs/context/AuthenticationProvider';
import ProgressProvider from '../libs/context/ProgressProvider';

const ApplicationProvider: FC = ({children}) => {
	return (
		<SafeAreaProvider>
			<ProgressProvider>
				<AuthenticationProvider>{children}</AuthenticationProvider>
			</ProgressProvider>
		</SafeAreaProvider>
	);
};

export default ApplicationProvider;
