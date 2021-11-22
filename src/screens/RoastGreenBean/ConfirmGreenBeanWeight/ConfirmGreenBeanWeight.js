import React, {FC, useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, SafeAreaView, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Input, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import Bean from '../../../core/entities/Bean';
import {createCardHeader} from '../../../libs/components/CardHeader';
import useLogger from '../../../libs/hooks/LoggerHook';
import useServices from '../../../libs/hooks/ServiceHook';

import ConfirmGreenBeanWeightScreenStyle from './ConfirmGreenBeanWeight.style';
import RoastGreenBeanRoutes from '../RoastGreenBeanRoutes';

export type BeanInformationScreenParams = {
	bean: Bean | null,
};
type BeanInformationScreenProps = NativeStackScreenProps<
	BeanInformationScreenParams,
	RoastGreenBeanRoutes.ConfirmGreenBeanWeight,
>;

const ConfirmGreenBeanWeight: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;
	const logger = useLogger(ConfirmGreenBeanWeight);
	const {handleError, handleErrors, production: productionService} = useServices();

	const [greenBeanWeight, setGreenBeanWeight] = useState(0);

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

	function onGreenBeanWeightInputChanged(value: string) {
		const parsedValue = parseFloat(value);
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

		Alert.alert('Add Stock', `Do you really want to roast ${greenBeanWeight} gram(s) of ${bean.name} bean?`, [
			{
				style: 'destructive',
				text: 'Cancel',
			},
			{
				text: 'Yes',
				onPress: () => {
					startProduction().then().catch();
				},
			},
		]);
	}

	async function startProduction() {
		try {
			const result = await productionService.start({
				beanId: bean.id,
				greenBeanWeight,
			});
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

	return (
		<SafeAreaView style={ConfirmGreenBeanWeightScreenStyle.container}>
			<ScrollView
				style={ConfirmGreenBeanWeightScreenStyle.scrollView}
				contentContainerStyle={ConfirmGreenBeanWeightScreenStyle.scrollViewContentContainer}>
				<FastImage
					style={ConfirmGreenBeanWeightScreenStyle.beanImage}
					resizeMode={FastImage.resizeMode.cover}
					source={{
						uri: API_BASE_URL + bean.image,
					}}
				/>
				<KeyboardAvoidingView
					style={ConfirmGreenBeanWeightScreenStyle.keyboardAvoidingView}
					behavior="position">
					<Card style={ConfirmGreenBeanWeightScreenStyle.beanCard} header={createCardHeader(bean.name)}>
						<Text category="p1">{bean.description}</Text>
					</Card>

					<Card>
						<Input
							style={ConfirmGreenBeanWeightScreenStyle.greenBeanWeightInput}
							value={greenBeanWeight.toString()}
							keyboardType="number-pad"
							label="Green Bean Weight (gram)"
							onChangeText={onGreenBeanWeightInputChanged}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						<Button
							style={ConfirmGreenBeanWeightScreenStyle.roastGreenBeanButton}
							onPress={onRoastGreenBean}>
							Roast {greenBeanWeight} grams of Green Bean
						</Button>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ConfirmGreenBeanWeight;
