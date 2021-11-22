import React, {FC, Fragment, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import Bean from '../../../core/entities/Bean';
import {createCardHeader} from '../../../libs/components/CardHeader';
import useLogger from '../../../libs/hooks/LoggerHook';
import useProgress from '../../../libs/hooks/ProgressHook';
import useServices from '../../../libs/hooks/ServiceHook';
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

// noinspection DuplicatedCode
const ConfirmBeanWeightScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const logger = useLogger(ConfirmBeanWeightScreen);
	const [progress] = useProgress();
	const {handleError, handleErrors, incomingGreenBean: incomingGreenBeanService} = useServices();

	const [confirmed, setConfirmed] = useState(false);
	const [greenBeanWeight, setGreenBeanWeight] = useState(0);
	const [greenBeanWeightString, setGreenBeanWeightString] = useState('0');
	const [succeed, setSucceed] = useState(false);

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
			`Do you really want to add ${greenBeanWeight} gram(s) of ${bean.name} bean to the inventory?`,
			[
				{
					style: 'destructive',
					text: 'Cancel',
				},
				{
					text: 'Yes',
					onPress: () => {
						setConfirmed(true);
						setSucceed(false);
						// createIncomingGreenBean().then().catch();
					},
				},
			],
		);
	}

	function onDoneButtonPressed() {
		navigation.navigate(DashboardRoutes.Main);
	}

	function onTryAgainButtonPressed() {
		setConfirmed(false);
	}

	async function createIncomingGreenBean() {
		try {
			const result = await incomingGreenBeanService.create(bean.id, {weight: greenBeanWeight});
			if (result.isSuccess && result.data) {
				// TODO: Do something;
				return;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	useEffect(onBeanUpdated, [bean]);

	const ConfirmScreen: FC = () => (
		<Fragment>
			<FastImage
				style={ConfirmBeanWeightScreenStyle.beanImage}
				resizeMode={FastImage.resizeMode.cover}
				source={{
					uri: API_BASE_URL + bean.image,
				}}
			/>
			<KeyboardAvoidingView style={ConfirmBeanWeightScreenStyle.keyboardAvoidingView} behavior="position">
				<Card style={ConfirmBeanWeightScreenStyle.beanCard} header={createCardHeader(bean.name)}>
					<Text category="p1">{bean.description}</Text>
				</Card>

				<Card>
					<Input
						style={ConfirmBeanWeightScreenStyle.greenBeanWeightInput}
						value={greenBeanWeightString}
						keyboardType="numeric"
						label="Green Bean Weight (gram)"
						placeholder="0"
						onChangeText={setGreenBeanWeightString}
						onEndEditing={onGreenBeanWeightStringEndEditing}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<Button onPress={onInputBeanToInventoryButtonPressed}>
						Add {greenBeanWeight} grams to Inventory
					</Button>
				</Card>
			</KeyboardAvoidingView>
		</Fragment>
	);

	const ResultScreen: FC = () => (
		<View style={ConfirmBeanWeightScreenStyle.resultView}>
			{progress.loading ? (
				<ActivityIndicator />
			) : succeed ? (
				<Text status="success">
					<Icon name="alert-circle" pack="ion" />
				</Text>
			) : (
				<Icon style={{...ConfirmBeanWeightScreenStyle.resultIcon}} name="alert-circle-outline" pack="ion" />
			)}
			<Text category="h6" status={progress.loading ? 'info' : succeed ? 'success' : 'danger'}>
				{progress.loading ? 'Adding to Inventory...' : succeed ? 'Success!' : 'Failed!'}
			</Text>
			{!progress.loading &&
				(succeed ? (
					<Button onPress={onDoneButtonPressed}>Done</Button>
				) : (
					<Button onPress={onTryAgainButtonPressed}>Try Again</Button>
				))}
		</View>
	);

	return (
		<SafeAreaView style={ConfirmBeanWeightScreenStyle.container}>
			<ScrollView
				style={ConfirmBeanWeightScreenStyle.scrollView}
				contentContainerStyle={ConfirmBeanWeightScreenStyle.scrollViewContentContainer}>
				{confirmed ? <ResultScreen /> : <ConfirmScreen />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmBeanWeightScreen;
