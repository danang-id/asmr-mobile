import React, {FC, useState} from 'react';
import {Image, SafeAreaView, Text, TextInput, TouchableOpacity, View, GestureResponderEvent, Alert} from 'react-native';
import ErrorCode from '../../../core/enums/ErrorCode';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import SignInScreenStyle from './SignInScreenStyle';

import AsmrTitle from '../../../assets/asmr-title.png';

const SignInScreen: FC = () => {
	const authentication = useAuthentication();
	const logger = useLogger(SignInScreen);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	function onSignInPressed(event: GestureResponderEvent) {
		event.preventDefault();
		signIn().then().catch();
	}

	function onSignInFailed(message: string) {
		Alert.alert('Sign In Failed', message, [{text: 'Try Again'}]);
	}

	async function signIn() {
		try {
			const result = await authentication.signIn(username, password);
			if (result.errors && result.errors[0]) {
				const firstError = result.errors[0];
				const haveAccountProblem =
					firstError.code === ErrorCode.EmailAddressWaitingConfirmation ||
					firstError.code === ErrorCode.AccountWaitingForApproval ||
					firstError.code === ErrorCode.AccountWasNotApproved;
				if (haveAccountProblem) {
					onSignInFailed(firstError.reason);
					return;
				}

				authentication.handleErrors(result.errors, logger);
			}
		} catch (error) {
			authentication.handleError(error, logger);
		}
	}

	return (
		<SafeAreaView style={SignInScreenStyle.container}>
			<View style={SignInScreenStyle.header}>
				<Image style={SignInScreenStyle.applicationLogo} source={AsmrTitle} />
			</View>
			<View style={SignInScreenStyle.signInForm}>
				<TextInput
					style={SignInScreenStyle.signInTextInput}
					placeholder="Username"
					onChangeText={setUsername}
				/>
				<TextInput
					style={SignInScreenStyle.signInTextInput}
					placeholder="Password"
					onChangeText={setPassword}
					secureTextEntry
				/>
			</View>
			<View style={SignInScreenStyle.actions}>
				<TouchableOpacity style={SignInScreenStyle.signInButton} onPress={onSignInPressed}>
					<Text>Sign In</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SignInScreen;
