import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';
import BeanInformationView from 'asmr/components/BeanInformationView';
import Bean from 'asmr/core/entities/Bean';
import useInventory from 'asmr/hooks/inventory.hook';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import {StockParamList} from 'asmr/screens/Stock/StockNavigator';
import StockRoutes from 'asmr/screens/Stock/StockRoutes';
import ConfirmationScreenStyle from './ConfirmationScreen.style';

type BeanInformationScreenProps = NativeStackScreenProps<StockParamList, StockRoutes.Confirmation>;

const ConfirmationScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {beanId} = route.params;
	const {getBeanById, stock: stockBean} = useInventory();

	const [bean, setBean] = useState<Bean | undefined>();
	const [confirmed, setConfirmed] = useState<boolean>(false);
	const [greenBeanWeight, setGreenBeanWeight] = useState<number>(0);
	const [greenBeanWeightString, setGreenBeanWeightString] = useState<string>('0');
	const [succeed, setSucceed] = useState<boolean>(false);

	const successIconRef = useRef<Icon<unknown>>(null);
	const failedIconRef = useRef<Icon<unknown>>(null);

	function onBeanIdChanged() {
		if (!beanId) {
			Alert.alert('Bean information not provided.', undefined, [
				{
					style: 'default',
					text: 'OK',
					onPress: () => {
						navigation.goBack();
					},
				},
			]);
			return;
		}

		setBean(getBeanById(beanId));
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
			`Do you really want to add ${formatValue(greenBeanWeight, 'gram')} of ${
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
		navigation.navigate(DashboardRoutes.Home);
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

	useEffect(onBeanIdChanged, [bean]);
	useEffect(onSucceedChanged, [confirmed, succeed]);

	if (confirmed) {
		return (
			<SafeAreaView style={ConfirmationScreenStyle.container}>
				<View style={ConfirmationScreenStyle.resultView}>
					{succeed ? (
						<Icon
							ref={successIconRef}
							style={{
								...ConfirmationScreenStyle.resultIcon,
								...ConfirmationScreenStyle.resultIconSuccess,
							}}
							name="checkmark-circle-outline"
							pack="ion"
							animation="pulse"
						/>
					) : (
						<Icon
							ref={failedIconRef}
							style={{
								...ConfirmationScreenStyle.resultIcon,
								...ConfirmationScreenStyle.resultIconFailed,
							}}
							name="alert-circle-outline"
							pack="ion"
							animation="shake"
						/>
					)}
					<Text
						style={ConfirmationScreenStyle.resultStatusText}
						category="h3"
						status={succeed ? 'success' : 'danger'}>
						{succeed ? 'Success' : 'Failed'}
					</Text>
					<Text style={ConfirmationScreenStyle.resultDescriptionText} category="p1">
						{succeed ? 'You have added' : 'Failed to add'} {formatValue(greenBeanWeight, 'gram')} of{' '}
						{bean?.name ?? ''} (green bean) to the inventory.
					</Text>
					<View style={ConfirmationScreenStyle.resultActionView}>
						{succeed ? (
							<Button
								style={ConfirmationScreenStyle.resultButton}
								size="large"
								onPress={onDoneButtonPressed}>
								Done
							</Button>
						) : (
							<Fragment>
								<Button
									style={ConfirmationScreenStyle.resultButton}
									appearance="outline"
									size="large"
									status="danger"
									onPress={onCancelButtonPressed}>
									Cancel
								</Button>
								<Button
									style={ConfirmationScreenStyle.resultButton}
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
		<SafeAreaView style={ConfirmationScreenStyle.container}>
			<BeanInformationView useKeyboardAvoidingView bean={bean}>
				<Card style={ConfirmationScreenStyle.confirmCard} appearance="filled">
					<Input
						style={ConfirmationScreenStyle.beanWeightInput}
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
						style={ConfirmationScreenStyle.addToInventoryButton}
						onPress={onInputBeanToInventoryButtonPressed}>
						{greenBeanWeight <= 0
							? 'Add to Stock'
							: `Add ${formatValue(greenBeanWeight, 'gram')} to Inventory`}
					</Button>
				</Card>
			</BeanInformationView>
		</SafeAreaView>
	);
};

export default ConfirmationScreen;
