import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createCardHeader} from 'asmr/components/CardHeader';
import useProduction from 'asmr/hooks/ProductionHook';
import {formatUnitValue} from 'asmr/libs/common/UnitHelper';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import {RoastGreenBeanParamList} from 'asmr/screens/RoastGreenBean/RoastGreenBeanNavigator';
import RoastGreenBeanRoutes from 'asmr/screens/RoastGreenBean/RoastGreenBeanRoutes';

import ConfirmGreenBeanWeightScreenStyle from './ConfirmGreenBeanWeightScreen.style';

type BeanInformationScreenProps = NativeStackScreenProps<
	RoastGreenBeanParamList,
	RoastGreenBeanRoutes.ConfirmGreenBeanWeight
>;
const ConfirmGreenBeanWeightScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const {start: startProduction} = useProduction();

	const [confirmed, setConfirmed] = useState<boolean>(false);
	const [greenBeanWeight, setGreenBeanWeight] = useState<number>(0);
	const [greenBeanWeightString, setGreenBeanWeightString] = useState<string>('0');
	const [succeed, setSucceed] = useState<boolean>(false);

	const successIconRef = useRef<Icon<unknown>>(null);
	const failedIconRef = useRef<Icon<unknown>>(null);

	function onBeanUpdated() {
		if (!bean) {
			Alert.alert('No Bean Information Provided', undefined, [
				{
					style: 'default',
					text: 'OK',
					onPress: () => {
						navigation.goBack();
					},
				},
			]);
		}
	}

	function onGreenBeanWeightStringEndEditing() {
		const parsedValue = parseFloat(greenBeanWeightString);
		if (isNaN(parsedValue)) {
			setGreenBeanWeightString('0');
			setGreenBeanWeight(0);
			return;
		}

		if (parsedValue <= 0) {
			setGreenBeanWeightString('0');
			setGreenBeanWeight(0);
			return;
		}

		setGreenBeanWeightString(parsedValue.toString(10));
		setGreenBeanWeight(parsedValue);
	}

	function onRoastGreenBean() {
		if (greenBeanWeight <= 0) {
			Alert.alert(`Please specify how much ${bean?.name ?? ''} bean you want to roast.`, undefined, [
				{
					style: 'default',
					text: 'Try Again',
				},
			]);
			return;
		}

		Alert.alert(
			'Roast Green Bean',
			`Do you really want to roast ${formatUnitValue(greenBeanWeight, 'gram')} of ${bean?.name ?? ''} bean?`,
			[
				{
					style: 'destructive',
					text: 'Cancel',
				},
				{
					style: 'default',
					text: 'Yes',
					onPress: () => {
						startProduction(bean?.id ?? '', greenBeanWeight)
							.then(roastedBeanProduction => {
								setConfirmed(true);
								setSucceed(!!roastedBeanProduction);
							})
							.catch(() => {
								setConfirmed(true);
								setSucceed(false);
							});
					},
				},
			],
		);
	}

	function onDoneButtonPressed() {
		navigation.navigate(DashboardRoutes.Main);
	}

	function onCancelButtonPressed() {
		navigation.navigate(DashboardRoutes.Create);
	}

	function onTryAgainButtonPressed() {
		setConfirmed(false);
	}

	function onSucceedChanged() {
		if (!confirmed) {
			return;
		}

		if (succeed) {
			successIconRef.current?.startAnimation();
		} else {
			failedIconRef.current?.startAnimation();
		}
	}

	useEffect(onBeanUpdated, [bean]);
	useEffect(onSucceedChanged, [confirmed, succeed]);

	if (confirmed) {
		return (
			<SafeAreaView style={ConfirmGreenBeanWeightScreenStyle.container}>
				<View style={ConfirmGreenBeanWeightScreenStyle.resultView}>
					{succeed ? (
						<Icon
							ref={successIconRef}
							style={{
								...ConfirmGreenBeanWeightScreenStyle.resultIcon,
								...ConfirmGreenBeanWeightScreenStyle.resultIconSuccess,
							}}
							name="sync-outline"
							pack="ion"
							animation="pulse"
							animationConfig={{cycles: Infinity, useNativeDriver: true}}
						/>
					) : (
						<Icon
							ref={failedIconRef}
							style={{
								...ConfirmGreenBeanWeightScreenStyle.resultIcon,
								...ConfirmGreenBeanWeightScreenStyle.resultIconFailed,
							}}
							name="alert-circle-outline"
							pack="ion"
							animation="shake"
						/>
					)}
					<Text
						style={ConfirmGreenBeanWeightScreenStyle.resultStatusText}
						category="h3"
						status={succeed ? 'info' : 'danger'}>
						{succeed ? 'Roasting started' : 'Failed'}
					</Text>
					<Text style={ConfirmGreenBeanWeightScreenStyle.resultDescriptionText} category="p1">
						{succeed ? 'You have put' : 'Failed to put'} {formatUnitValue(greenBeanWeight, 'gram')} of{' '}
						{bean?.name ?? ''} green bean to the roasting process.
					</Text>
					<View style={ConfirmGreenBeanWeightScreenStyle.resultActionView}>
						{succeed ? (
							<Button
								style={ConfirmGreenBeanWeightScreenStyle.resultButton}
								size="large"
								onPress={onDoneButtonPressed}>
								Done
							</Button>
						) : (
							<Fragment>
								<Button
									style={ConfirmGreenBeanWeightScreenStyle.resultButton}
									appearance="outline"
									size="large"
									status="danger"
									onPress={onCancelButtonPressed}>
									Cancel
								</Button>
								<Button
									style={ConfirmGreenBeanWeightScreenStyle.resultButton}
									size="large"
									onPress={onTryAgainButtonPressed}>
									Try Again
								</Button>
							</Fragment>
						)}
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={ConfirmGreenBeanWeightScreenStyle.container}>
			<ScrollView
				style={ConfirmGreenBeanWeightScreenStyle.scrollView}
				contentContainerStyle={ConfirmGreenBeanWeightScreenStyle.scrollViewContentContainer}>
				<KeyboardAvoidingView
					style={ConfirmGreenBeanWeightScreenStyle.keyboardAvoidingView}
					behavior="position">
					<FastImage
						style={ConfirmGreenBeanWeightScreenStyle.beanImage}
						resizeMode={FastImage.resizeMode.cover}
						source={{
							uri: API_BASE_URL + bean?.image ?? '',
						}}
					/>

					<Card
						style={ConfirmGreenBeanWeightScreenStyle.beanCard}
						header={createCardHeader(bean?.name ?? '')}
						appearance="filled"
						status="primary">
						<Text category="p1">{bean?.description ?? ''}</Text>
					</Card>

					<Card style={ConfirmGreenBeanWeightScreenStyle.confirmCard} appearance="filled">
						<Input
							style={ConfirmGreenBeanWeightScreenStyle.beanWeightInput}
							value={greenBeanWeightString}
							keyboardType="numeric"
							label="Green Bean Weight (gram)"
							placeholder="0"
							onChangeText={setGreenBeanWeightString}
							onEndEditing={onGreenBeanWeightStringEndEditing}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						<Button
							style={ConfirmGreenBeanWeightScreenStyle.roastGreenBeanButton}
							onPress={onRoastGreenBean}>
							{greenBeanWeight <= 0
								? 'Roast Green Bean'
								: `Roast ${formatUnitValue(greenBeanWeight, 'gram')} of Green Bean`}
						</Button>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmGreenBeanWeightScreen;
