import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Card, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';
import BeanInformationView from 'asmr/components/BeanInformationView';
import CardHeader from 'asmr/components/CardHeader';
import StatisticItem from 'asmr/components/StatisticItem';
import TimeAgo from 'asmr/components/TimeAgo';
import Bean from 'asmr/core/entities/Bean';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import useBean from 'asmr/hooks/bean.hook';
import useMounted from 'asmr/hooks/mounted.hook';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import {BeanListParamList} from 'asmr/screens/Dashboard/BeanList/BeanListNavigator';
import BeanListRoutes from 'asmr/screens/Dashboard/BeanList/BeanListRoutes';
import BeanInformationScreenStyle from './BeanInformationScreen.style';

type BeanInformationScreenProps = NativeStackScreenProps<BeanListParamList, BeanListRoutes.BeanInformation>;
const BeanInformationScreen: FC<BeanInformationScreenProps> = ({route}) => {
	const mounted = useMounted(BeanInformationScreen);
	const {beanId} = route.params;

	const {getBeanById, getBusinessAnalyticsByBeanId} = useBean();

	const [bean, setBean] = useState<Bean | undefined>();
	const [analytics, setAnalytics] = useState<StructuredBusinessAnalytics | undefined>();

	function onBeanIdChanged() {
		if (!beanId) {
			setBean(undefined);
			return;
		}

		getBeanById(beanId, false)
			.then(data => {
				if (mounted) {
					setBean(data);
				}
			})
			.catch();
		getBusinessAnalyticsByBeanId(beanId)
			.then(data => {
				if (mounted) {
					setAnalytics(data);
				}
			})
			.catch();
	}

	useEffect(onBeanIdChanged, [beanId]);

	if (bean && !analytics) {
		return (
			<SafeAreaView style={BeanInformationScreenStyle.container}>
				<BeanInformationView bean={bean} />
				<View style={BeanInformationScreenStyle.analyticsView}>
					<ActivityIndicator />
					<Text style={BeanInformationScreenStyle.analyticsText}>Getting statistical information...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={BeanInformationScreenStyle.container}>
			<BeanInformationView bean={bean}>
				<Card
					style={[BeanInformationScreenStyle.baseCard, BeanInformationScreenStyle.greenBeanCard]}
					header={<CardHeader title="Green Bean" />}
					appearance="filled">
					{!!bean && (
						<Fragment>
							<StatisticItem style={BeanInformationScreenStyle.statisticItem} name="On Inventory">
								{formatValue(bean.inventory.currentGreenBeanWeight, 'gram')}
							</StatisticItem>
							<StatisticItem style={BeanInformationScreenStyle.statisticItem} name="Last Added">
								{analytics?.incomingGreenBean.lastTime ? (
									<TimeAgo date={new Date(analytics?.incomingGreenBean.lastTime)} />
								) : (
									'Never'
								)}
							</StatisticItem>
						</Fragment>
					)}
				</Card>
				<Card
					style={[BeanInformationScreenStyle.baseCard, BeanInformationScreenStyle.roastedBeanCard]}
					header={<CardHeader title="Roasted Bean" />}
					appearance="filled">
					{!!bean && (
						<Fragment>
							<StatisticItem style={BeanInformationScreenStyle.statisticItem} name="On Inventory">
								{formatValue(bean.inventory.currentRoastedBeanWeight, 'gram')}
							</StatisticItem>
							{!!analytics?.roasting.total && (
								<StatisticItem style={BeanInformationScreenStyle.statisticItem} name="Total Roasting">
									{formatValue(analytics.roasting.total, 'time')}
								</StatisticItem>
							)}
							{!!analytics?.roasting.finished.total && !!analytics.roasting.total && (
								<StatisticItem
									style={BeanInformationScreenStyle.statisticItem}
									name="Roasting Finished (% rate)">
									{formatValue(analytics.roasting.finished.total, 'time')} (
									{((analytics.roasting.finished.total / analytics.roasting.total) * 100).toFixed(2)}
									%)
								</StatisticItem>
							)}
							{!!analytics?.roasting.cancelled.total && !!analytics.roasting.total && (
								<StatisticItem
									style={BeanInformationScreenStyle.statisticItem}
									name="Roasting Cancelled (% rate)">
									{formatValue(analytics.roasting.cancelled.total, 'time')} (
									{((analytics.roasting.cancelled.total / analytics.roasting.total) * 100).toFixed(2)}
									%)
								</StatisticItem>
							)}
							{!!analytics?.roasting.roastedBean.weightTotal && (
								<StatisticItem style={BeanInformationScreenStyle.statisticItem} name="Produced">
									{formatValue(analytics.roasting.roastedBean.weightTotal, 'gram')} [RB]
								</StatisticItem>
							)}
							{!!analytics?.roasting.roastedBean.weightAverage && (
								<StatisticItem
									style={BeanInformationScreenStyle.statisticItem}
									name="Produced (Average)">
									{formatValue(analytics.roasting.roastedBean.weightAverage, 'gram')} [RB]
								</StatisticItem>
							)}
							{!!analytics?.roasting.depreciation.rate && (
								<StatisticItem
									style={BeanInformationScreenStyle.statisticItem}
									name="Depreciation Rate">
									{(analytics.roasting.depreciation.rate * 100).toFixed(2)}%
								</StatisticItem>
							)}
							{!!analytics?.roasting.depreciation.averageRate && (
								<StatisticItem
									style={BeanInformationScreenStyle.statisticItem}
									name="Depreciation Rate (Average)">
									{(analytics.roasting.depreciation.averageRate * 100).toFixed(2)}%
								</StatisticItem>
							)}
							{(!!analytics?.roasting.depreciation.rate ||
								!!analytics?.roasting.depreciation.averageRate) && (
								<Text style={BeanInformationScreenStyle.statisticItem}>
									Depreciation is the amount of reduction in the weight of the roasted beans compared
									to their original weight of the green bean.
								</Text>
							)}
						</Fragment>
					)}
				</Card>
				<View style={BeanInformationScreenStyle.analyticsView}>
					<Text style={BeanInformationScreenStyle.analyticsText}>
						More information about this bean will shown up when more bean processing happened.
					</Text>
				</View>
			</BeanInformationView>
		</SafeAreaView>
	);
};

export default BeanInformationScreen;
