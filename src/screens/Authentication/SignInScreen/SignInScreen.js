import React, {FC, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, useColorScheme, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Card, Icon, Input} from '@ui-kitten/components';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import ErrorCode from '../../../core/enums/ErrorCode';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import SignInScreenStyle from './SignInScreenStyle';
import AppTitleImage from '../../../components/AppTitleImage';

const SignInScreen: FC = () => {
	const authentication = useAuthentication();
	const logger = useLogger(SignInScreen);
	const passwordInputRef = useRef();
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	function onUsernameEndEditing() {
		passwordInputRef?.current?.focus();
	}

	function onPasswordEndEditing() {
		setSecureTextEntry(true);
	}

	function onShowHidePasswordPressed() {
		setSecureTextEntry(!secureTextEntry);
	}

	function onSignInPressed() {
		signIn().then().catch();
	}

	function onSignInFailed(message: string) {
		Alert.alert('Sign In Failed', message, [{text: 'Try Again'}]);
	}

	async function signIn() {
		if (isSigningIn) {
			return;
		}

		try {
			setIsSigningIn(true);
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
		} finally {
			setIsSigningIn(false);
		}
	}

	const renderIcon = props => (
		<TouchableOpacity onPress={onShowHidePasswordPressed}>
			<Icon {...props} name={secureTextEntry ? 'eye' : 'eye-off'} />
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={SignInScreenStyle.container}>
			<SpinnerOverlay
				visible={isSigningIn}
				animation="fade"
				overlayColor="rgba(67,45,39,200)"
				textContent="Signing you in..."
				textStyle={SignInScreenStyle.spinnerOverlayText}
			/>
			<KeyboardAvoidingView style={SignInScreenStyle.keyboardAvoidingView} behavior="padding">
				<View style={SignInScreenStyle.headerLayout}>
					<AppTitleImage style={SignInScreenStyle.appTitleImage} />
				</View>
				<Card style={SignInScreenStyle.signInCard} status="primary">
					<Input
						style={SignInScreenStyle.input}
						value={username}
						label="Username"
						placeholder="Enter your username"
						onChangeText={setUsername}
						onEndEditing={onUsernameEndEditing}
						autoCapitalize="none"
						autoCorrect={false}
						textContentType="username"
					/>
					<Input
						style={SignInScreenStyle.input}
						ref={passwordInputRef}
						value={password}
						label="Password"
						placeholder="Enter your password"
						accessoryRight={renderIcon}
						secureTextEntry={secureTextEntry}
						onChangeText={setPassword}
						onEndEditing={onPasswordEndEditing}
						autoCapitalize="none"
						autoCorrect={false}
						textContentType="password"
					/>
				</Card>
				<View style={SignInScreenStyle.actionLayout}>
					<Button size="large" onPress={onSignInPressed}>
						Sign In
					</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default SignInScreen;
