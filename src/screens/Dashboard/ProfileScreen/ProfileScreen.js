import React, {FC, useCallback, useEffect, useState} from 'react';
import {Alert, RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import Gleap from 'react-native-gleapsdk';
import {FileSystem} from 'react-native-file-access';
import {FileLogger as FileLogging} from 'react-native-file-logger';
import {API_BASE_URL, GLEAP_TOKEN} from '@env';
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
	const {user, handleError, handleErrors, signOut: doSignOut, refresh: refreshAuthentication} = useAuthentication();
	const logger = useLogger(ProfileScreen);
	const [joinedOn, setJoinedOn] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [roles, setRoles] = useState('');
	const [roleToBe, setRoleToBe] = useState('');

	async function onInit() {
		onUserDataUpdate();
		await refreshAuthentication();
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
		refreshAuthentication().finally(() => {
			setRefreshing(false);
		});
	}, []);

	function onShareFeedbackButtonPressed() {
		if (!GLEAP_TOKEN) {
			Alert.alert(
				'Feedback Center Unavailable',
				'Unfortunately, feedback center is not available in this version of the application.',
			);
			return;
		}

		openFeedbackCenter().catch();
	}

	function onSignOutButtonPressed() {
		Alert.alert('Sign Out', 'Are you sure you really want to sign out?', [
			{
				style: 'cancel',
				text: 'Cancel',
			},
			{
				style: 'destructive',
				text: 'Sign Out',
				onPress: () => {
					signOut().catch();
				},
			},
		]);
	}

	function onSignOutFailed(message: string) {
		Alert.alert('Sign Out Failed', message, [
			{
				style: 'default',
				text: 'Try Again',
			},
		]);
	}

	async function openFeedbackCenter() {
		try {
			const logFiles: {name: string, content: string}[] = [];

			const paths = await FileLogging.getLogFilePaths();
			if (!paths || !Array.isArray(paths)) {
				return;
			}

			for (const path of paths) {
				if (logFiles.length >= 6) {
					continue;
				}

				const pathArray = path.split('/');
				const name = pathArray[pathArray.length - 1];
				const content = await FileSystem.readFile(path, 'base64');
				logFiles.push({name, content});
			}

			Gleap.removeAllAttachments();
			for (const logFile of logFiles) {
				Gleap.addAttachment(logFile.content, logFile.name);
			}
		} catch (error) {
			logger.error(error);
		} finally {
			Gleap.open();
		}
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
				<Card style={ProfileScreenStyle.usernameCard} header={createCardHeader('Username')} appearance="filled">
					<Text>{user.username}</Text>
				</Card>
				<Card
					style={ProfileScreenStyle.emailAddressCard}
					header={createCardHeader('Email Address')}
					appearance="filled">
					<Text>{user.emailAddress}</Text>
				</Card>
				<Card
					style={ProfileScreenStyle.workRolesCard}
					header={createCardHeader('Work Roles')}
					appearance="filled">
					{roles ? (
						<Text>
							Your {roleToBe} {roles}
						</Text>
					) : (
						<Text>Your roles have not been assigned</Text>
					)}
				</Card>
				<View style={ProfileScreenStyle.actionView}>
					<Button
						style={ProfileScreenStyle.shareFeedbackButton}
						appearance="outline"
						onPress={onShareFeedbackButtonPressed}>
						Share Feedback
					</Button>
					<Button style={ProfileScreenStyle.signOutButton} status="danger" onPress={onSignOutButtonPressed}>
						SIGN OUT
					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
