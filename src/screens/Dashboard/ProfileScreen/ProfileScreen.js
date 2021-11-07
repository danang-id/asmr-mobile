import React, {FC} from 'react';
import {Alert, GestureResponderEvent, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import ErrorCode from '../../../core/enums/ErrorCode';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import ProfileScreenStyle from './ProfileScreenStyle';

const ProfileScreen: FC = () => {
	const authentication = useAuthentication();
	const logger = useLogger(ProfileScreen);

	function onSignOutPressed(event: GestureResponderEvent) {
		event.preventDefault();
		Alert.alert('Sign Out', 'Are you sure you really want to sign out?', [
			{
				text: 'Cancel',
			},
			{
				text: 'Sign Out',
				style: 'destructive',
				onPress: () => {
					signOut().then().catch();
				},
			},
		]);
	}

	function onSignOutFailed(message: string) {
		Alert.alert('Sign Out Failed', message, [{text: 'Try Again'}]);
	}

	async function signOut() {
		try {
			const result = await authentication.signOut();
			if (result.errors && result.errors[0]) {
				const firstError = result.errors[0];
				const haveAccountProblem =
					firstError.code === ErrorCode.EmailAddressWaitingConfirmation ||
					firstError.code === ErrorCode.AccountWaitingForApproval ||
					firstError.code === ErrorCode.AccountWasNotApproved;
				if (haveAccountProblem) {
					onSignOutFailed(firstError.reason);
					return;
				}

				authentication.handleErrors(result.errors, logger);
			}
		} catch (error) {
			authentication.handleError(error, logger);
		}
	}

	return (
		<SafeAreaView style={ProfileScreenStyle.container}>
			<Text style={ProfileScreenStyle.firstNameText}>Hi, {authentication.user.firstName}!</Text>
			<TouchableOpacity style={ProfileScreenStyle.signOutButton} onPress={onSignOutPressed}>
				<Text>Sign Out</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default ProfileScreen;
