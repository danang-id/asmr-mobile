import React, {FC, useEffect, useState} from 'react';
import {Alert, FlatList, GestureResponderEvent, SafeAreaView, ScrollView, View} from 'react-native';
import {Avatar, Button, Card, Divider, Icon, Layout, List, ListItem, Text} from '@ui-kitten/components';
import ErrorCode from '../../../core/enums/ErrorCode';
import {getHumanizedDate, processResource} from '../../../libs/common/Helpers';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import ProfileScreenStyle from './ProfileScreenStyle';

const data = new Array(8).fill({
	title: 'Title for Item',
	description: 'Description for Item',
});

const ProfileScreen: FC = () => {
	const authentication = useAuthentication();
	const logger = useLogger(ProfileScreen);
	const [joinedOn, setJoinedOn] = useState('');

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

	useEffect(() => {
		if (authentication.user && authentication.user.createdAt) {
			setJoinedOn(getHumanizedDate(authentication.user.createdAt));
		}
	}, [authentication.user]);

	const renderItemAccessory = props => <Button size="tiny">FOLLOW</Button>;

	const renderItemIcon = props => <Icon {...props} name="person" />;

	const renderItem = ({item, index}) => (
		<ListItem
			title={`${item.title} ${index + 1}`}
			accessoryLeft={renderItemIcon}
			accessoryRight={renderItemAccessory}
			ItemSeparatorComponent={Divider}
		/>
	);

	return (
		<SafeAreaView style={ProfileScreenStyle.container}>
			<FlatList
				data={data}
				renderItem={renderItem}
				style={ProfileScreenStyle.list}
				ListHeaderComponent={() => (
					<View style={ProfileScreenStyle.listHeaderView}>
						<Avatar
							style={ProfileScreenStyle.avatar}
							source={{uri: processResource(authentication.user.image)}}
							shape="round"
						/>
						<Text style={ProfileScreenStyle.nameText}>
							{authentication.user.firstName} {authentication.user.lastName}
						</Text>
						{!!joinedOn && (
							<Text style={ProfileScreenStyle.joinedOnText} appearance="hint">
								Joined on {joinedOn}
							</Text>
						)}
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

export default ProfileScreen;
