import React, {FC, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Text} from '@ui-kitten/components';
import AppTitleImage from '../../../components/AppTitleImage';
import useInit from '../../../libs/hooks/InitHook';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import HomeScreenStyle from './HomeScreenStyle';

const HomeScreen: FC = () => {
	useInit(onInit);
	const authentication = useAuthentication();
	const [greetingText, setGreetingText] = useState('');

	async function onInit() {
		let newGreetingText = '';
		const date = new Date();
		const hour = date.getHours();
		if (hour < 12) {
			newGreetingText += 'Good morning, ';
		} else if (hour >= 12 && hour <= 17) {
			newGreetingText += 'Good afternoon, ';
		} else if (hour >= 17 && hour <= 24) {
			newGreetingText += 'Good evening, ';
		}
		newGreetingText += authentication.user.firstName + '!';
		setGreetingText(newGreetingText);
	}

	return (
		<SafeAreaView style={HomeScreenStyle.container}>
			<View style={HomeScreenStyle.headerView}>
				<AppTitleImage style={HomeScreenStyle.appTitleImage} />
				<Text style={HomeScreenStyle.greetingText}>{greetingText}</Text>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
