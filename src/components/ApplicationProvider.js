import React, {FC} from 'react';
import AuthenticationProvider from '../libs/context/AuthenticationProvider';
import ProgressProvider from '../libs/context/ProgressProvider';

const ApplicationProvider: FC = ({children}) => {
	return (
		<ProgressProvider>
			<AuthenticationProvider>{children}</AuthenticationProvider>
		</ProgressProvider>
	);
};

export const withProvider = (Component: () => Node) => {
	return () => (
		<ApplicationProvider>
			<Component />
		</ApplicationProvider>
	);
};

export default ApplicationProvider;
