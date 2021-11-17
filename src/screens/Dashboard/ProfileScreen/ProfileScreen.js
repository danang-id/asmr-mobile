import React, {FC, useCallback, useEffect, useState} from 'react';
import {Alert, GestureResponderEvent, RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {getApplicationName, getBuildNumber, getVersion} from 'react-native-device-info';
import {Button, Card, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import ErrorCode from '../../../core/enums/ErrorCode';
import {createCardHeader} from '../../../libs/components/CardHeader';
import {getHumanizedDate} from '../../../libs/common/DateHelper';
import {getRoleString} from '../../../libs/common/RoleHelper';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useInit from '../../../libs/hooks/InitHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import ProfileScreenStyle from './ProfileScreen.style';

const ProfileScreen: FC = () => {
	useInit(onInit);
	const applicationName = getApplicationName();
	const buildNumber = getBuildNumber();
	const version = getVersion();
	const {user, handleError, handleErrors, signOut: doSignOut, updateUserData} = useAuthentication();
	const logger = useLogger(ProfileScreen);
	const [joinedOn, setJoinedOn] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [roles, setRoles] = useState('');
	const [roleToBe, setRoleToBe] = useState('');

	async function onInit() {
		onUserDataUpdate();
		await updateUserData();
	}

	function onUserDataUpdate() {
		if (!user) {
			return;
		}

		if (user.createdAt) {
			setJoinedOn(getHumanizedDate(user.createdAt));
		}

		if (user.roles) {
			setRoles(user.roles.map(userRole => getRoleString(userRole.role)).join(' and '));
			setRoleToBe(user.roles.length === 1 ? 'role is' : 'roles are');
		}
	}

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		updateUserData().finally(() => {
			setRefreshing(false);
		});
	}, []);

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
			const result = await doSignOut();
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

				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	useEffect(onUserDataUpdate, [user]);

	return (
		<SafeAreaView style={ProfileScreenStyle.container}>
			<ScrollView
				style={ProfileScreenStyle.scrollView}
				contentContainerStyle={ProfileScreenStyle.scrollViewContentContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} title="Refreshing information..." />
				}>
				<View style={ProfileScreenStyle.headerView}>
					<FastImage
						style={ProfileScreenStyle.avatar}
						resizeMode={FastImage.resizeMode.contain}
						source={{
							uri: API_BASE_URL + user.image,
							priority: FastImage.priority.high,
						}}
					/>
					<Text style={ProfileScreenStyle.nameText}>
						{user.firstName} {user.lastName}
					</Text>
					{!!joinedOn && (
						<Text style={ProfileScreenStyle.joinedOnText} appearance="hint">
							Joined on {joinedOn}
						</Text>
					)}
				</View>
				<Card style={ProfileScreenStyle.usernameCard} header={createCardHeader('Username')}>
					<Text>{user.username}</Text>
				</Card>
				<Card style={ProfileScreenStyle.emailAddressCard} header={createCardHeader('Email Address')}>
					<Text>{user.emailAddress}</Text>
				</Card>
				<Card style={ProfileScreenStyle.workRolesCard} header={createCardHeader('Work Roles')}>
					{roles ? (
						<Text>
							Your {roleToBe} {roles}.
						</Text>
					) : (
						<Text>Your roles have not been assigned.</Text>
					)}
				</Card>
				<View style={ProfileScreenStyle.actionView}>
					<Button style={ProfileScreenStyle.signOutButton} status="danger" onPress={onSignOutPressed}>
						SIGN OUT
					</Button>
				</View>
				<View style={ProfileScreenStyle.aboutView}>
					<Text style={ProfileScreenStyle.versionText}>
						{applicationName} v{version} ({buildNumber})
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
