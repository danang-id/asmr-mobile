import React, {FC} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Text} from '@ui-kitten/components';

import ApplicationLogoImage from '../../../components/ApplicationLogoImage';
import useInit from '../../../libs/hooks/InitHook';
import useProduction from '../../../libs/hooks/ProductionHook';
import ScreenRoutes from '../../ScreenRoutes';
import DashboardRoutes from '../DashboardRoutes';
import CreateScreenStyle from './CreateScreen.style';

type CreateScreenProps = BottomTabScreenProps<{}, DashboardRoutes.Create>;

const CreateScreen: FC<CreateScreenProps> = ({navigation}) => {
	useInit(onInit);
	const {ongoing: ongoingProduction, hasOngoingProduction, refresh: refreshProduction} = useProduction();

	async function onInit() {
		await refreshProduction();
	}

	function onAddGreenBeanStockButtonPressed() {
		navigation.navigate(ScreenRoutes.AddGreenBeanStock);
	}

	function onRoastGreenBeanButtonPressed() {
		if (hasOngoingProduction()) {
			Alert.alert(
				'Roasting on-progress',
				`You are currently roasting ${ongoingProduction.bean.name} bean.\n\n` +
					'Please wait until the current roasting process to finished before you roast another bean.',
				[
					{
						style: 'default',
						text: 'See Roasting Status',
						onPress: () => {
							navigation.navigate(ScreenRoutes.RoastingProcess);
						},
					},
					{
						style: 'cancel',
						text: 'OK',
					},
				],
			);
			return;
		}

		navigation.navigate(ScreenRoutes.RoastGreenBean);
	}

	return (
		<SafeAreaView style={CreateScreenStyle.container}>
			<View style={CreateScreenStyle.contentView}>
				<View style={CreateScreenStyle.headerView}>
					<ApplicationLogoImage style={CreateScreenStyle.appTitleImage} />
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
						appearance={hasOngoingProduction() ? 'outline' : 'filled'}
						status={hasOngoingProduction() ? 'basic' : 'primary'}
						size="large">
						Roast Green Bean
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default CreateScreen;
