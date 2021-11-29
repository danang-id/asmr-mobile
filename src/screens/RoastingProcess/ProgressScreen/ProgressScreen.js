import React, {FC, useCallback, useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Input, Text} from '@ui-kitten/components';

import ApplicationLogoImage from '../../../components/ApplicationLogoImage';
import ProgressView from '../../../components/ProgressView';
import {formatUnitValue} from '../../../libs/common/UnitHelper';
import {createCardHeader} from '../../../libs/components/CardHeader';
import useInit from '../../../libs/hooks/InitHook';
import useProduction from '../../../libs/hooks/ProductionHook';
import DashboardRoutes from '../../Dashboard/DashboardRoutes';
import ScreenRoutes from '../../ScreenRoutes';
import RoastingRoutes from '../RoastingProcessRoutes';
import ProgressScreenStyle from './ProgressScreen.style';

type ProgressScreenParams = {};
type ProgressScreenProps = NativeStackScreenProps<ProgressScreenParams, RoastingRoutes.Progress>;

const ProgressScreen: FC<ProgressScreenProps> = ({navigation}) => {
	useInit(onInit);
	const {
		ongoing: ongoingProduction,
		hasOngoingProduction,
		finish: finalizeProduction,
		cancel: cancelProduction,
		refresh: refreshProduction,
	} = useProduction();

	const [acting, setActing] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [roastedBeanWeight, setRoastedBeanWeight] = useState(0);
	const [roastedBeanWeightString, setRoastedBeanWeightString] = useState('0');

	async function onInit() {
		await refreshProduction();
		checkOngoingProduction();

		setInitialized(true);
	}

	const onRefresh = useCallback(() => {
		if (acting) {
			return;
		}

		setActing(true);
		setRefreshing(true);
		refreshProduction()
			.then(() => {
				checkOngoingProduction();
			})
			.finally(() => {
				setRefreshing(false);
				setActing(false);
			});
	}, []);

	function onRoastedBeanWeightEndEditing() {
		const parsedValue = parseFloat(roastedBeanWeightString);
		if (isNaN(parsedValue)) {
			setRoastedBeanWeightString('0');
			setRoastedBeanWeight(0);
			return;
		}

		if (parsedValue <= 0) {
			setRoastedBeanWeightString('0');
			setRoastedBeanWeight(0);
			return;
		}

		const maximumValue = ongoingProduction?.production?.greenBeanWeight ?? 1;
		const maximumValueUnitString = formatUnitValue(maximumValue, 'gram');
		if (parsedValue > maximumValue) {
			Alert.alert(
				`Maximum roasted bean produced is ${maximumValueUnitString}, ` +
					`because you only roast ${maximumValueUnitString} of green bean.`,
			);
			setRoastedBeanWeightString(maximumValue.toString(10));
			setRoastedBeanWeight(maximumValue);
			return;
		}

		setRoastedBeanWeightString(parsedValue.toString(10));
		setRoastedBeanWeight(parsedValue);
	}

	function onFinalizeButtonPressed() {
		if (acting) {
			return;
		}

		if (roastedBeanWeight <= 0) {
			Alert.alert('Please specify how much roasted bean you have produced.', undefined, [
				{
					style: 'default',
					text: 'Try Again',
				},
			]);
			return;
		}

		setActing(true);
		Alert.alert(
			'End Roasting',
			`Add ${formatUnitValue(roastedBeanWeight, 'gram')} of roasted ` +
				`${ongoingProduction?.bean?.name ?? ''} to the inventory and end roasting?`,
			[
				{
					style: 'default',
					text: 'Continue Roasting',
				},
				{
					style: 'cancel',
					text: 'Yes, End Roasting',
					onPress: () => {
						finalizeProduction(roastedBeanWeight)
							.then(() => {
								Alert.alert(
									'Roasting Success',
									`${formatUnitValue(roastedBeanWeight, 'gram')} of roasted ` +
										`${ongoingProduction?.bean?.name ?? ''} have been added to the inventory.`,
								);
								navigation.navigate(ScreenRoutes.Dashboard);
							})
							.catch();
					},
				},
			],
		);
		setActing(false);
	}

	function onCancelButtonPressed() {
		if (acting) {
			return;
		}

		setActing(true);
		Alert.alert(
			'Cancel Roasting',
			`Do you really want to cancel the roasting process of ${ongoingProduction?.bean?.name ?? ''} bean?`,
			[
				{
					style: 'destructive',
					text: 'Yes, cancel roasting',
					onPress: () => {
						// cancelProduction().catch();
					},
				},
				{
					style: 'default',
					text: 'No',
				},
			],
		);
		setActing(false);
	}

	function checkOngoingProduction() {
		if (!hasOngoingProduction()) {
			Alert.alert("You don't have any ongoing roasting.", undefined, [
				{
					style: 'default',
					text: 'Go Back',
					onPress: () => {
						navigation.navigate(DashboardRoutes.Main);
					},
				},
			]);
			return;
		}
	}

	if (!initialized) {
		return (
			<SafeAreaView style={ProgressScreenStyle.container}>
				<ScrollView
					style={ProgressScreenStyle.scrollView}
					contentContainerStyle={ProgressScreenStyle.scrollViewContentContainer}>
					<View style={ProgressScreenStyle.headerView}>
						<ApplicationLogoImage style={ProgressScreenStyle.appTitleImage} />
					</View>
					<View style={ProgressScreenStyle.loadingView}>
						<ActivityIndicator />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<ProgressView>
			<SafeAreaView style={ProgressScreenStyle.container}>
				<KeyboardAvoidingView behavior="position">
					<ScrollView
						style={ProgressScreenStyle.scrollView}
						contentContainerStyle={ProgressScreenStyle.scrollViewContentContainer}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								title="Refreshing information..."
							/>
						}>
						<View style={ProgressScreenStyle.headerView}>
							<ApplicationLogoImage style={ProgressScreenStyle.appTitleImage} />
						</View>
						<View style={ProgressScreenStyle.contentView}>
							<Text style={ProgressScreenStyle.currentlyRoastingText}>Currently roasting</Text>
							<Text style={ProgressScreenStyle.beanNameText}>
								{ongoingProduction?.bean?.name ?? 'Bean Name'}
							</Text>
							<Card style={ProgressScreenStyle.greenBeanWeightCard} appearance="filled" status="primary">
								<Text style={ProgressScreenStyle.greenBeanWeightText}>
									Using {formatUnitValue(ongoingProduction?.production?.greenBeanWeight ?? 0, 'gram')}{' '}
									of green bean
								</Text>
							</Card>
							<Card style={ProgressScreenStyle.beanDescriptionCard} appearance="filled">
								<Text>{ongoingProduction?.bean?.description ?? 'Bean description'}</Text>
							</Card>
							<Card
								style={ProgressScreenStyle.confirmCard}
								header={createCardHeader('Finalize Roasting', 'end the process of current roasting')}
								appearance="filled">
								<Input
									style={ProgressScreenStyle.beanWeightInput}
									disabled={refreshing}
									editable={!acting}
									value={roastedBeanWeightString}
									keyboardType="numeric"
									label="Roasted Bean Produced (gram)"
									placeholder="0"
									onChangeText={setRoastedBeanWeightString}
									onEndEditing={onRoastedBeanWeightEndEditing}
									autoCapitalize="none"
									autoCorrect={false}
								/>
								<Button
									style={ProgressScreenStyle.finalizeButton}
									disabled={refreshing}
									status="success"
									onPress={onFinalizeButtonPressed}>
									{roastedBeanWeight <= 0
										? 'Add Roasted Bean'
										: `Add ${formatUnitValue(roastedBeanWeight, 'gram')} of Roasted Bean`}
								</Button>
							</Card>
							<Card style={ProgressScreenStyle.cancelCard} appearance="filled">
								<Button
									style={ProgressScreenStyle.cancelButton}
									disabled={refreshing}
									status="danger"
									onPress={onCancelButtonPressed}>
									CANCEL
								</Button>
							</Card>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</ProgressView>
	);
};

export default ProgressScreen;
