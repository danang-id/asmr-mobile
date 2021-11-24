import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import Bean from '../../../core/entities/Bean';
import {formatUnitValue} from '../../../libs/common/UnitHelper';
import {createCardHeader} from '../../../libs/components/CardHeader';
import useProduction from '../../../libs/hooks/ProductionHook';
import DashboardRoutes from '../../Dashboard/DashboardRoutes';
import RoastGreenBeanRoutes from '../RoastGreenBeanRoutes';

import ConfirmGreenBeanWeightScreenStyle from './ConfirmGreenBeanWeightScreen.style';

export type BeanInformationScreenParams = {
	bean: Bean | null,
};
type BeanInformationScreenProps = NativeStackScreenProps<
	BeanInformationScreenParams,
	RoastGreenBeanRoutes.ConfirmGreenBeanWeight,
>;

const ConfirmGreenBeanWeightScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const {start: startProduction} = useProduction();

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

	function onRoastGreenBean() {
		if (greenBeanWeight <= 0) {
			Alert.alert(`Please specify how much ${bean.name} bean you want to roast.`, undefined, [
				{
					style: 'default',
					text: 'Try Again',
				},
			]);
			return;
		}

		Alert.alert(
			'Roast Green Bean',
			`Do you really want to roast ${formatUnitValue(greenBeanWeight, 'gram')} of ${bean.name} bean?`,
			[
				{
					style: 'destructive',
					text: 'Cancel',
				},
				{
					text: 'Yes',
					onPress: () => {
						startProduction(bean.id, greenBeanWeight)
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
							animationConfig={{cycles: Infinity}}
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
						{bean.name} green bean to the roasting process.
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
							uri: API_BASE_URL + bean.image,
						}}
					/>

					<Card style={ConfirmGreenBeanWeightScreenStyle.beanCard} header={createCardHeader(bean.name)}>
						<Text category="p1">{bean.description}</Text>
					</Card>

					<Card style={ConfirmGreenBeanWeightScreenStyle.confirmCard}>
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
							Roast {formatUnitValue(greenBeanWeight, 'gram')} of Green Bean
						</Button>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmGreenBeanWeightScreen;
