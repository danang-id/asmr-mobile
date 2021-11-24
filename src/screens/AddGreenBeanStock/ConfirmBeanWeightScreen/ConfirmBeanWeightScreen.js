import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import Bean from '../../../core/entities/Bean';
import {formatUnitValue} from '../../../libs/common/UnitHelper';
import {createCardHeader} from '../../../libs/components/CardHeader';
import useInventory from '../../../libs/hooks/InventoryHook';
import DashboardRoutes from '../../Dashboard/DashboardRoutes';
import AddGreenBeanStockRoutes from '../AddGreenBeanStockRoutes';

import ConfirmBeanWeightScreenStyle from './ConfirmBeanWeightScreen.style';

export type BeanInformationScreenParams = {
	bean: Bean | null,
};
type BeanInformationScreenProps = NativeStackScreenProps<
	BeanInformationScreenParams,
	AddGreenBeanStockRoutes.ConfirmBeanWeightScreen,
>;

const ConfirmBeanWeightScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const {stock: stockBean} = useInventory();

	const [confirmed, setConfirmed] = useState(false);
	const [greenBeanWeight, setGreenBeanWeight] = useState(0);
	const [greenBeanWeightString, setGreenBeanWeightString] = useState('0');
	const [succeed, setSucceed] = useState(false);

	const successIconRef = useRef();
	const failedIconRef = useRef();

	function onBeanUpdated() {
		if (!bean) {
			Alert.alert('No Bean Information Provided', undefined, [
				{
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
		const isValueAllowed = !isNaN(parsedValue) && parsedValue > 0;
		setGreenBeanWeight(isValueAllowed ? parsedValue : 0);
	}

	function onInputBeanToInventoryButtonPressed() {
		if (greenBeanWeight <= 0) {
			Alert.alert(`Please specify how much you want to add ${bean.name} bean to inventory.`, undefined, [
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
				bean.name
			} bean to the inventory?`,
			[
				{
					style: 'destructive',
					text: 'Cancel',
				},
				{
					text: 'Yes',
					onPress: () => {
						stockBean(bean.id, greenBeanWeight)
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
						{bean.name} bean to the inventory.
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
							uri: API_BASE_URL + bean.image,
						}}
					/>

					<Card style={ConfirmBeanWeightScreenStyle.beanCard} header={createCardHeader(bean.name)}>
						<Text category="p1">{bean.description}</Text>
					</Card>

					<Card style={ConfirmBeanWeightScreenStyle.confirmCard}>
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
							Add {formatUnitValue(greenBeanWeight, 'gram')} to Inventory
						</Button>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmBeanWeightScreen;
