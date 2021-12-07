import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Input, Text} from '@ui-kitten/components';
import React, {FC, useCallback, useState} from 'react';
import {ActivityIndicator, Alert, KeyboardAvoidingView, RefreshControl, ScrollView} from 'react-native';
import CardHeader from 'asmr/components/CardHeader';
import StatisticItem from 'asmr/components/StatisticItem';
import TimeAgo from 'asmr/components/TimeAgo';
import useAuthentication from 'asmr/hooks/authentication.hook';
import {useInit} from 'asmr/hooks/init.hook';
import useProduction from 'asmr/hooks/production.hook';
import useRefresh from 'asmr/hooks/refresh.hook';
import DashboardLayout from 'asmr/layouts/DashboardLayout';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import {RoastingProcessParamList} from 'asmr/screens/Roasting/RoastingNavigator';
import RoastingRoutes from 'asmr/screens/Roasting/RoastingRoutes';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import ProgressScreenStyle from './ProgressScreen.style';

type ProgressScreenProps = NativeStackScreenProps<RoastingProcessParamList, RoastingRoutes.Progress>;
const ProgressScreen: FC<ProgressScreenProps> = ({navigation}) => {
	useInit(onInit);
	const {user} = useAuthentication();
	const {
		ongoing: ongoingProduction,
		hasOngoingProduction,
		finish: finishProduction,
		cancel: cancelProduction,
		refresh: refreshProduction,
	} = useProduction();
	const [refreshing, refresh] = useRefresh([refreshProduction]);

	const [acting, setActing] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [roastedBeanWeight, setRoastedBeanWeight] = useState(0);
	const [roastedBeanWeightString, setRoastedBeanWeightString] = useState('0');

	function onInit() {
		checkOngoingProduction();
		setInitialized(true);
	}

	const onRefresh = useCallback(() => {
		if (acting) {
			return;
		}

		setActing(true);
		refresh(() => {
			checkOngoingProduction();
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
		const maximumValueUnitString = formatValue(maximumValue, 'gram');
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

	function onFinishButtonPressed() {
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
			'Finish Roasting',
			`Do you want to finish the roasting and put ${formatValue(roastedBeanWeight, 'gram')} of roasted ` +
				`${ongoingProduction?.bean?.name ?? ''} to the inventory?`,
			[
				{
					style: 'cancel',
					text: 'Continue Roasting',
				},
				{
					style: 'destructive',
					text: 'Finish Roasting',
					onPress: () => {
						finishProduction(roastedBeanWeight)
							.then(() => {
								Alert.alert(
									'Roasting Success',
									`${formatValue(roastedBeanWeight, 'gram')} of roasted ` +
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
			`Do you really want to cancel the roasting of ${ongoingProduction?.bean?.name ?? ''} bean?`,
			[
				{
					style: 'destructive',
					text: 'Cancel Roasting',
					onPress: () => {
						onConfirmCancel();
					},
				},
				{
					style: 'cancel',
					text: 'Continue Roasting',
					onPress: () => {
						setActing(false);
					},
				},
			],
		);
	}

	function onConfirmCancel() {
		Alert.alert(
			'Cancellation Reason',
			'Is this roasting was cancelled due to a failure?\n\n' +
				'When a roasting is failed, the green bean will NOT be added back to the inventory, ' +
				'and it will be assumed that it was burnt.',
			[
				{
					style: 'destructive',
					text: 'Yes, Roasting Failed',
					onPress: () => {
						cancelProduction(true)
							.then(() => {
								Alert.alert('Roasting Successfully Cancelled');
								navigation.navigate(ScreenRoutes.Dashboard);
							})
							.catch()
							.finally(() => {
								setActing(false);
							});
					},
				},
				{
					style: 'default',
					text: 'No, Green Bean is Intact',
					onPress: () => {
						cancelProduction(false)
							.then(() => {
								Alert.alert('Roasting Successfully Cancelled');
								navigation.navigate(ScreenRoutes.Dashboard);
							})
							.catch()
							.finally(() => {
								setActing(false);
							});
					},
				},
				{
					style: 'cancel',
					text: 'Stay Roasting',
					onPress: () => {
						setActing(false);
					},
				},
			],
		);
	}

	function checkOngoingProduction() {
		if (!hasOngoingProduction()) {
			Alert.alert("You don't have any ongoing roasting.", undefined, [
				{
					style: 'default',
					text: 'Go Back',
					onPress: () => {
						navigation.navigate(DashboardRoutes.Home);
					},
				},
			]);
			return;
		}
	}

	if (!initialized) {
		return (
			<DashboardLayout style={{height: '100%'}} contentContainerStyle={ProgressScreenStyle.loadingView}>
				<ActivityIndicator />
				<Text style={ProgressScreenStyle.loadingText}>Getting roasting progress information...</Text>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout contentContainerStyle={ProgressScreenStyle.contentView} scrollable>
			<KeyboardAvoidingView behavior="height">
				<ScrollView
					style={ProgressScreenStyle.scrollView}
					contentContainerStyle={ProgressScreenStyle.scrollViewContentContainer}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} title="Updating information..." />
					}>
					<Text style={ProgressScreenStyle.currentlyRoastingText}>Currently roasting</Text>
					<Text style={ProgressScreenStyle.beanNameText}>{ongoingProduction?.bean?.name ?? 'Bean Name'}</Text>
					<Card style={ProgressScreenStyle.greenBeanWeightCard} appearance="filled" status="primary">
						<StatisticItem style={ProgressScreenStyle.statisticItem} name="Roaster">
							{user?.firstName} {user?.lastName}
						</StatisticItem>
						<StatisticItem style={ProgressScreenStyle.statisticItem} name="Green Bean Used">
							{formatValue(ongoingProduction?.production?.greenBeanWeight ?? 0, 'gram')}
						</StatisticItem>
						<StatisticItem style={ProgressScreenStyle.statisticItem} name="Started">
							<TimeAgo date={new Date(ongoingProduction?.production?.createdAt ?? new Date())} />
						</StatisticItem>
					</Card>
					<Card style={ProgressScreenStyle.beanDescriptionCard} appearance="filled">
						<Text>{ongoingProduction?.bean?.description ?? 'Bean description'}</Text>
					</Card>
					<Card
						style={ProgressScreenStyle.confirmCard}
						header={
							<CardHeader title="Finish Roasting" information="End the process of current roasting." />
						}
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
							onPress={onFinishButtonPressed}>
							{roastedBeanWeight <= 0
								? 'Add Roasted Bean'
								: `Add ${formatValue(roastedBeanWeight, 'gram')} of Roasted Bean`}
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
				</ScrollView>
			</KeyboardAvoidingView>
		</DashboardLayout>
	);
};

export default ProgressScreen;
