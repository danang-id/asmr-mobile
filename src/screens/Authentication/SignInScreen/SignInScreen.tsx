import {Button, Card, Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {FC, useRef, useState} from 'react';
import {Alert, ImageProps, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import useAuthentication from 'asmr/hooks/AuthenticationHook';
import useLogger from 'asmr/hooks/LoggerHook';
import SignInScreenStyle from './SignInScreen.style';

const SignInScreen: FC = () => {
	const authentication = useAuthentication();
	const logger = useLogger(SignInScreen);

	const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

	const passwordInputRef = useRef<Input>(null);

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
		signIn().catch();
	}

	function onSignInFailed(message: string) {
		Alert.alert('Sign In Failed', message, [
			{
				style: 'default',
				text: 'Try Again',
			},
		]);
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
				setIsSigningIn(false);
			}
		} catch (error) {
			authentication.handleError(error as Error, logger);
			setIsSigningIn(false);
		}
	}

	const renderAccessoryRight: RenderProp<Partial<ImageProps>> = props => (
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
					<ApplicationLogoImage style={SignInScreenStyle.appTitleImage} />
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
						accessoryRight={renderAccessoryRight}
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
