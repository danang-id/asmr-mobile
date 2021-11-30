import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Text} from '@ui-kitten/components';
import React, {FC} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';

import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useProduction from 'asmr/hooks/ProductionHook';
import {DashboardParamList} from 'asmr/screens/Dashboard/DashboardNavigator';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import CreateScreenStyle from './CreateScreen.style';

type CreateScreenProps = BottomTabScreenProps<DashboardParamList, DashboardRoutes.Create>;
const CreateScreen: FC<CreateScreenProps> = ({navigation}) => {
	useInitAsync(onInitAsync);
	const {ongoing: ongoingProduction, hasOngoingProduction, refresh: refreshProduction} = useProduction();

	async function onInitAsync(): Promise<void> {
		await refreshProduction();
	}

	function onAddGreenBeanStockButtonPressed() {
		navigation.navigate(ScreenRoutes.AddGreenBeanStock);
	}

	function onRoastGreenBeanButtonPressed() {
		if (hasOngoingProduction()) {
			Alert.alert(
				'Roasting on-progress',
				`You are currently roasting ${ongoingProduction?.bean.name ?? ''} bean.\n\n` +
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
