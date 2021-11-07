import React, {FC, useState} from 'react';
import useAuthentication from '../libs/hooks/AuthenticationHook';
import useInit from '../libs/hooks/InitHook';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';
import DashboardNavigator from './Dashboard/DashboardNavigator';
import SplashScreen from './Misc/SplashScreen';

const RootNavigator: FC = () => {
	useInit(onInit);
	const authentication = useAuthentication();
	const [initialized, setInitialized] = useState(false);

	async function onInit() {
		await authentication.updateUserData();
		setInitialized(true);
	}

	if (!initialized) {
		return <SplashScreen />;
	}

	if (!authentication.isAuthenticated()) {
		return <AuthenticationNavigator />;
	}

	return <DashboardNavigator />;
};

export default RootNavigator;
