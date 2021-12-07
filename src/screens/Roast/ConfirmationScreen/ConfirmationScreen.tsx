import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Icon, Input, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';
import BeanInformationView from 'asmr/components/BeanInformationView';
import Bean from 'asmr/core/entities/Bean';
import useInventory from 'asmr/hooks/inventory.hook';
import useProduction from 'asmr/hooks/production.hook';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import {RoastParamList} from 'asmr/screens/Roast/RoastNavigator';
import RoastRoutes from 'asmr/screens/Roast/RoastRoutes';
import ConfirmationScreenStyle from './ConfirmationScreen.style';

type BeanInformationScreenProps = NativeStackScreenProps<RoastParamList, RoastRoutes.Confirmation>;
const ConfirmationScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {beanId} = route.params;
	const {getBeanById} = useInventory();
	const {start: startProduction} = useProduction();

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
			`Do you really want to roast ${formatValue(greenBeanWeight, 'gram')} of ${bean?.name ?? ''} bean?`,
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
							name="sync-outline"
							pack="ion"
							animation="pulse"
							animationConfig={{cycles: Infinity, useNativeDriver: true}}
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
						status={succeed ? 'info' : 'danger'}>
						{succeed ? 'Roasting started' : 'Failed'}
					</Text>
					<Text style={ConfirmationScreenStyle.resultDescriptionText} category="p1">
						{succeed ? 'You have put' : 'Failed to put'} {formatValue(greenBeanWeight, 'gram')} of{' '}
						{bean?.name ?? ''} green bean to the roasting process.
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
					<Button style={ConfirmationScreenStyle.roastGreenBeanButton} onPress={onRoastGreenBean}>
						{greenBeanWeight <= 0
							? 'Roast Green Bean'
							: `Roast ${formatValue(greenBeanWeight, 'gram')} of Green Bean`}
					</Button>
				</Card>
			</BeanInformationView>
		</SafeAreaView>
	);
};

export default ConfirmationScreen;
