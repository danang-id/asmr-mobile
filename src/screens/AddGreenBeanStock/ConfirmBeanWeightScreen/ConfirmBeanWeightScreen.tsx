import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createCardHeader} from 'asmr/components/CardHeader';
import useInventory from 'asmr/hooks/InventoryHook';
import {formatUnitValue} from 'asmr/libs/common/UnitHelper';
import {AddGreenBeanStockParamList} from 'asmr/screens/AddGreenBeanStock/AddGreenBeanStockNavigator';
import AddGreenBeanStockRoutes from 'asmr/screens/AddGreenBeanStock/AddGreenBeanStockRoutes';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import ConfirmBeanWeightScreenStyle from './ConfirmBeanWeightScreen.style';

type BeanInformationScreenProps = NativeStackScreenProps<
	AddGreenBeanStockParamList,
	AddGreenBeanStockRoutes.ConfirmBeanWeightScreen
>;

const ConfirmBeanWeightScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const {stock: stockBean} = useInventory();

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

	function onInputBeanToInventoryButtonPressed() {
		if (greenBeanWeight <= 0) {
			Alert.alert(`Please specify how much you want to add ${bean?.name ?? ''} bean to inventory.`, undefined, [
				{
					style: 'default',
					text: 'Try Again',
				},
			]);
			return;
		}

		Alert.alert(
			'Add Stock',
			`Do you really want to add ${formatUnitValue(greenBeanWeight, 'gram')} of ${
				bean?.name ?? ''
			} (green bean) to the inventory?`,
			[
				{
					style: 'destructive',
					text: 'Cancel',
				},
				{
					text: 'Yes',
					onPress: () => {
						stockBean(bean?.id ?? '', greenBeanWeight)
							.then(incomingGreenBean => {
								setConfirmed(true);
								setSucceed(!!incomingGreenBean);
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
			<SafeAreaView style={ConfirmBeanWeightScreenStyle.container}>
				<View style={ConfirmBeanWeightScreenStyle.resultView}>
					{succeed ? (
						<Icon
							ref={successIconRef}
							style={{
								...ConfirmBeanWeightScreenStyle.resultIcon,
								...ConfirmBeanWeightScreenStyle.resultIconSuccess,
							}}
							name="checkmark-circle-outline"
							pack="ion"
							animation="pulse"
						/>
					) : (
						<Icon
							ref={failedIconRef}
							style={{
								...ConfirmBeanWeightScreenStyle.resultIcon,
								...ConfirmBeanWeightScreenStyle.resultIconFailed,
							}}
							name="alert-circle-outline"
							pack="ion"
							animation="shake"
						/>
					)}
					<Text
						style={ConfirmBeanWeightScreenStyle.resultStatusText}
						category="h3"
						status={succeed ? 'success' : 'danger'}>
						{succeed ? 'Success' : 'Failed'}
					</Text>
					<Text style={ConfirmBeanWeightScreenStyle.resultDescriptionText} category="p1">
						{succeed ? 'You have added' : 'Failed to add'} {formatUnitValue(greenBeanWeight, 'gram')} of{' '}
						{bean?.name ?? ''} (green bean) to the inventory.
					</Text>
					<View style={ConfirmBeanWeightScreenStyle.resultActionView}>
						{succeed ? (
							<Button
								style={ConfirmBeanWeightScreenStyle.resultButton}
								size="large"
								onPress={onDoneButtonPressed}>
								Done
							</Button>
						) : (
							<Fragment>
								<Button
									style={ConfirmBeanWeightScreenStyle.resultButton}
									appearance="outline"
									size="large"
									status="danger"
									onPress={onCancelButtonPressed}>
									Cancel
								</Button>
								<Button
									style={ConfirmBeanWeightScreenStyle.resultButton}
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
		<SafeAreaView style={ConfirmBeanWeightScreenStyle.container}>
			<ScrollView
				style={ConfirmBeanWeightScreenStyle.scrollView}
				contentContainerStyle={ConfirmBeanWeightScreenStyle.scrollViewContentContainer}>
				<KeyboardAvoidingView style={ConfirmBeanWeightScreenStyle.keyboardAvoidingView} behavior="position">
					<FastImage
						style={ConfirmBeanWeightScreenStyle.beanImage}
						resizeMode={FastImage.resizeMode.cover}
						source={{
							uri: API_BASE_URL + bean?.image ?? '',
						}}
					/>

					<Card
						style={ConfirmBeanWeightScreenStyle.beanCard}
						header={createCardHeader(bean?.name ?? '')}
						appearance="filled"
						status="primary">
						<Text category="p1">{bean?.description ?? ''}</Text>
					</Card>

					<Card style={ConfirmBeanWeightScreenStyle.confirmCard} appearance="filled">
						<Input
							style={ConfirmBeanWeightScreenStyle.beanWeightInput}
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
							style={ConfirmBeanWeightScreenStyle.addToInventoryButton}
							onPress={onInputBeanToInventoryButtonPressed}>
							{greenBeanWeight <= 0
								? 'Add to Inventory'
								: `Add ${formatUnitValue(greenBeanWeight, 'gram')} to Inventory`}
						</Button>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmBeanWeightScreen;
