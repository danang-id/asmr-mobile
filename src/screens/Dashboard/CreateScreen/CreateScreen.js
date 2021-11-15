import React, {FC} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@ui-kitten/components';

import AppTitleImage from '../../../components/AppTitleImage';
import ScreenRoutes from '../../ScreenRoutes';
import CreateScreenStyle from './CreateScreen.style';

const CreateScreen: FC = () => {
	const navigation = useNavigation();

	function onAddIncomingGreenBeanButtonPressed() {
		navigation.navigate(ScreenRoutes.IncomingGreenBean);
	}

	function onRoastGreenBeanButtonPressed() {
		navigation.navigate(ScreenRoutes.RoastGreenBean);
	}

	return (
		<SafeAreaView style={CreateScreenStyle.container}>
			<View style={CreateScreenStyle.contentView}>
				<View style={CreateScreenStyle.headerView}>
					<AppTitleImage style={CreateScreenStyle.appTitleImage} />
				</View>
				<View style={CreateScreenStyle.createView}>
					<Text style={CreateScreenStyle.createQuestionText}>What would you like to do?</Text>
					<Button
						style={CreateScreenStyle.addIncomingGreenBeanButton}
						onPress={onAddIncomingGreenBeanButtonPressed}
						size="large">
						Add Incoming Green Bean
					</Button>
					<Button
						style={CreateScreenStyle.roastGreenBeanButton}
						onPress={onRoastGreenBeanButtonPressed}
						size="large">
						Roast Green Bean
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default CreateScreen;
