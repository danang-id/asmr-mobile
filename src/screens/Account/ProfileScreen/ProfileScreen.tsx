import {API_BASE_URL, GLEAP_TOKEN} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Text} from '@ui-kitten/components';
import React, {FC, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, SafeAreaView, ScrollView, View} from 'react-native';
import {FileSystem} from 'react-native-file-access';
import {FileLogger as FileLogging} from 'react-native-file-logger';
import Gleap from 'react-native-gleapsdk';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import CardHeader from 'asmr/components/CardHeader';
import ImageViewer from 'asmr/components/ImageViewer';
import ProfilePicture from 'asmr/components/ProfilePicture';
import StatisticItem from 'asmr/components/StatisticItem';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/authentication.hook';
import useLogger from 'asmr/hooks/logger.hook';
import useMounted from 'asmr/hooks/mounted.hook';
import useRefreshOnFocus from 'asmr/hooks/refresh-on-focus.hook';
import {getHumanizedDate} from 'asmr/libs/common/Date.helper';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import {getRoleString} from 'asmr/libs/common/Role.helper';
import {AccountParamList} from 'asmr/screens/Account/AccountNavigator';
import AccountRoutes from 'asmr/screens/Account/AccountRoutes';
import applicationColors from 'asmr/styles/colors';
import ProfileScreenStyle from './ProfileScreen.style';

type ProfileScreenProps = NativeStackScreenProps<AccountParamList, AccountRoutes.Profile>;
const ProfileScreen: FC<ProfileScreenProps> = () => {
	const mounted = useMounted(ProfileScreen);
	const logger = useLogger(ProfileScreen);

	const {businessAnalytics, isBusinessAnalyticsLoading, user, isAuthorized, signOut, refresh} = useAuthentication();

	const [joinedOn, setJoinedOn] = useState<string>('');
	const [imageViewerShown, setImageViewerShown] = useState<boolean>(false);
	const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
	const [roles, setRoles] = useState<string>('');

	useRefreshOnFocus(() => refresh());

	function onInitialized() {
		onUserChanged();
	}

	function onUserChanged() {
		if (!user || !mounted) {
			return;
		}

		if (user.createdAt) {
			setJoinedOn('Joined on ' + getHumanizedDate(user.createdAt));
		}

		if (user.roles) {
			setRoles(user.roles.map(userRole => getRoleString(userRole.role)).join(' and '));
		}
	}

	function onProfilePicturePressed() {
		setImageViewerShown(true);
	}

	function onProfilePictureViewerClosed() {
		setImageViewerShown(false);
	}

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
				onPress: onSignOutConfirmed,
			},
		]);
	}

	function onSignOutConfirmed() {
		setIsSigningOut(true);

		signOut()
			.catch()
			.finally(() => {
				if (mounted) {
					setIsSigningOut(false);
				}
			});
	}

	async function openFeedbackCenter() {
		try {
			const logFiles: {name: string; content: string}[] = [];

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

	useEffect(onInitialized, []);
	useEffect(onUserChanged, [user]);

	return (
		<SafeAreaView style={ProfileScreenStyle.container}>
			<SpinnerOverlay
				visible={isSigningOut}
				animation="fade"
				overlayColor={applicationColors.primary}
				textContent="Signing you out..."
				textStyle={ProfileScreenStyle.spinnerOverlayText}
			/>
			<ImageViewer
				uri={API_BASE_URL + user?.image ?? ''}
				visible={imageViewerShown}
				onClose={onProfilePictureViewerClosed}
				title={user ? user.firstName + ' ' + user.lastName : 'Profile Picture'}
			/>
			<ScrollView
				style={ProfileScreenStyle.scrollView}
				contentContainerStyle={ProfileScreenStyle.scrollViewContentContainer}>
				<View style={ProfileScreenStyle.headerView}>
					<ProfilePicture
						style={ProfileScreenStyle.profilePicture}
						size={125}
						rounded
						onPress={onProfilePicturePressed}
					/>
					<Text style={ProfileScreenStyle.nameText}>
						{user?.firstName ?? ''} {user?.lastName ?? ''}
					</Text>
					<Text style={ProfileScreenStyle.joinedOnText} appearance="hint">
						{joinedOn}
					</Text>
				</View>
				<Card
					style={ProfileScreenStyle.myProfileCard}
					header={<CardHeader title="My Profile" />}
					appearance="filled">
					<StatisticItem style={ProfileScreenStyle.statisticItem} name="Username">
						{user?.username ?? ''}
					</StatisticItem>
					<StatisticItem style={ProfileScreenStyle.statisticItem} name="Email Address">
						{user?.emailAddress ?? ''}
					</StatisticItem>
					<StatisticItem style={ProfileScreenStyle.statisticItem} name="Work Roles">
						{roles ? roles : 'Not Assigned'}
					</StatisticItem>
					<Text style={ProfileScreenStyle.changeProfileText}>
						Please contact our Administrator to change your profile information.
					</Text>
				</Card>
				{isAuthorized([Role.Roaster]) && (
					<Card
						style={ProfileScreenStyle.roastingAnalyticsCard}
						header={<CardHeader title="Roasting Statistics" />}
						appearance="filled">
						{!businessAnalytics && isBusinessAnalyticsLoading && <ActivityIndicator />}
						{!!businessAnalytics?.roasting.total && (
							<StatisticItem style={ProfileScreenStyle.statisticItem} name="Total Roasting">
								{formatValue(businessAnalytics.roasting.total, 'time')}
							</StatisticItem>
						)}
						{!!businessAnalytics?.roasting.finished.total && !!businessAnalytics.roasting.total && (
							<StatisticItem style={ProfileScreenStyle.statisticItem} name="Roasting Finished (% rate)">
								{formatValue(businessAnalytics.roasting.finished.total, 'time')} (
								{(
									(businessAnalytics.roasting.finished.total / businessAnalytics.roasting.total) *
									100
								).toFixed(2)}
								%)
							</StatisticItem>
						)}
						{!!businessAnalytics?.roasting.cancelled.total && !!businessAnalytics.roasting.total && (
							<StatisticItem style={ProfileScreenStyle.statisticItem} name="Roasting Cancelled (% rate)">
								{formatValue(businessAnalytics.roasting.cancelled.total, 'time')} (
								{(
									(businessAnalytics.roasting.cancelled.total / businessAnalytics.roasting.total) *
									100
								).toFixed(2)}
								%)
							</StatisticItem>
						)}
						<Text style={ProfileScreenStyle.moreAnalyticText}>
							More information will shown up when you done more bean processing.
						</Text>
					</Card>
				)}
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
