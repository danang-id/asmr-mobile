import React, {FC, useEffect} from 'react';
import {Alert, SafeAreaView, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import {API_BASE_URL} from '@env';
import Bean from '../../../core/entities/Bean';

import BeanInformationScreenStyle from './BeanInformationScreen.style';
import RoastGreenBeanRoutes from '../RoastGreenBeanRoutes';

export type BeanInformationScreenParams = {
	bean: Bean | null,
};
type BeanInformationScreenProps = NativeStackScreenProps<
	BeanInformationScreenParams,
	RoastGreenBeanRoutes.BeanInformation,
>;

// noinspection DuplicatedCode
const BeanInformationScreen: FC<BeanInformationScreenProps> = ({navigation, route}) => {
	const {bean} = route.params;

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

	function onRoastThisBeanButtonPressed() {
		Alert.alert('Roasted sir!', 'Feature not available at the moment.');
	}

	useEffect(onBeanUpdated, [bean]);

	return (
		<SafeAreaView style={BeanInformationScreenStyle.container}>
			<ScrollView
				style={BeanInformationScreenStyle.scrollView}
				contentContainerStyle={BeanInformationScreenStyle.scrollViewContentContainer}>
				<FastImage
					style={BeanInformationScreenStyle.beanImage}
					resizeMode={FastImage.resizeMode.contain}
					source={{
						uri: API_BASE_URL + bean.image,
					}}
				/>
				<Text style={BeanInformationScreenStyle.beanNameText} category="h3">
					{bean.name}
				</Text>
				<Text style={BeanInformationScreenStyle.beanDescriptionText} category="p1">
					{bean.description}
				</Text>
				<Button onPress={onRoastThisBeanButtonPressed}>Roast this Bean</Button>
			</ScrollView>
		</SafeAreaView>
	);
};

export default BeanInformationScreen;
