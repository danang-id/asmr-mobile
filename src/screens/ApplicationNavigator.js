import React, {FC} from 'react';
import SplashScreen from 'react-native-splash-screen';
import useAuthentication from '../libs/hooks/AuthenticationHook';
import useInit from '../libs/hooks/InitHook';
import AuthenticationNavigator from './Authentication/AuthenticationNavigator';
import DashboardNavigator from './Dashboard/DashboardNavigator';

const ApplicationNavigator: FC = () => {
	useInit(onInit);
	const authentication = useAuthentication();

	async function onInit() {
		await authentication.updateUserData();
		SplashScreen.hide();
	}

	if (!authentication.isAuthenticated()) {
		return <AuthenticationNavigator />;
	}

	return <DashboardNavigator />;
};

export default ApplicationNavigator;
