import {Button, Card, Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {FC, useRef, useState} from 'react';
import {ImageProps, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import useAuthentication from 'asmr/hooks/authentication.hook';
import useMounted from 'asmr/hooks/mounted.hook';
import applicationColors from 'asmr/styles/colors';
import SignInScreenStyle from './SignInScreen.style';

const SignInScreen: FC = () => {
	const mounted = useMounted(SignInScreen);
	const {signIn} = useAuthentication();

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
		setIsSigningIn(true);

		signIn(username, password)
			.catch()
			.finally(() => {
				if (mounted) {
					setIsSigningIn(false);
				}
			});
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
				overlayColor={applicationColors.primary}
				textContent="Signing you in..."
				textStyle={SignInScreenStyle.spinnerOverlayText}
			/>
			<KeyboardAvoidingView style={SignInScreenStyle.keyboardAvoidingView} behavior="height">
				<View style={SignInScreenStyle.headerLayout}>
					<ApplicationLogoImage style={SignInScreenStyle.applicationLogoImage} />
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
