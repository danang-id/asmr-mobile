import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Text} from '@ui-kitten/components';
import React, {FC} from 'react';
import {Alert} from 'react-native';

import useMounted from 'asmr/hooks/mounted.hook';
import useProduction from 'asmr/hooks/production.hook';
import useRefresh from 'asmr/hooks/refresh.hook';
import DashboardLayout from 'asmr/layouts/DashboardLayout';
import {DashboardParamList} from 'asmr/screens/Dashboard/DashboardNavigator';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import CreateScreenStyle from './CreateScreen.style';

type CreateScreenProps = BottomTabScreenProps<DashboardParamList, DashboardRoutes.Create>;
const CreateScreen: FC<CreateScreenProps> = ({navigation}) => {
	const mounted = useMounted(CreateScreen);
	const {ongoing: ongoingProduction, hasOngoingProduction, refresh: refreshProduction} = useProduction();
	useRefresh([refreshProduction]);

	function onAddGreenBeanStockButtonPressed() {
		navigation.navigate(ScreenRoutes.Stock);
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
							navigation.navigate(ScreenRoutes.Roasting);
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

		navigation.navigate(ScreenRoutes.Roast);
	}

	function onPackageRoastedBeanButtonPressed() {
		navigation.navigate(ScreenRoutes.Packaging);
	}

	return (
		<DashboardLayout header={{showBorder: true}} contentContainerStyle={CreateScreenStyle.contentContainer}>
			<Text style={CreateScreenStyle.createQuestionText}>What would you like to do today?</Text>
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
			<Button
				style={CreateScreenStyle.packageRoastedBeanButton}
				onPress={onPackageRoastedBeanButtonPressed}
				size="large">
				Package Roasted Bean
			</Button>
		</DashboardLayout>
	);
};

export default CreateScreen;
