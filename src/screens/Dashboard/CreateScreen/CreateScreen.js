import React, {FC} from 'react';
import {SafeAreaView, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Text} from '@ui-kitten/components';

import AppTitleImage from '../../../components/AppTitleImage';
import ScreenRoutes from '../../ScreenRoutes';
import DashboardRoutes from '../DashboardRoutes';
import CreateScreenStyle from './CreateScreen.style';

type CreateScreenProps = BottomTabScreenProps<{}, DashboardRoutes.Create>;

const CreateScreen: FC<CreateScreenProps> = ({navigation}) => {
	function onAddGreenBeanStockButtonPressed() {
		navigation.navigate(ScreenRoutes.AddGreenBeanStock);
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
						style={CreateScreenStyle.addGreenBeanStockButton}
						onPress={onAddGreenBeanStockButtonPressed}
						size="large">
						Add Green Bean Stock
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
