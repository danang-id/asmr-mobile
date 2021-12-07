import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Divider, Text} from '@ui-kitten/components';
import React, {FC, Fragment, memo, useCallback, useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Linking,
	ListRenderItem,
	RefreshControl,
	TouchableHighlight,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Bean from 'asmr/core/entities/Bean';
import useBean from 'asmr/hooks/bean.hook';
import useMounted from 'asmr/hooks/mounted.hook';
import useRefreshOnFocus from 'asmr/hooks/refresh-on-focus.hook';
import DashboardLayout from 'asmr/layouts/DashboardLayout';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import {BeanListParamList} from 'asmr/screens/Dashboard/BeanList/BeanListNavigator';
import BeanListRoutes from 'asmr/screens/Dashboard/BeanList/BeanListRoutes';
import applicationColors from 'asmr/styles/colors';
import BeanListScreenStyle from './BeanListScreen.style';

type BeanListScreenProps = NativeStackScreenProps<BeanListParamList, BeanListRoutes.BeanListIndex>;
const BeanListScreen: FC<BeanListScreenProps> = ({navigation}) => {
	const mounted = useMounted(BeanListScreen);
	const {beans, isLoading, refresh: refreshBean} = useBean();

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().catch();
	}, []);

	const [hasBeans, setHasBeans] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);

	useRefreshOnFocus(() => refresh());

	const onBeanItemPressed = useCallback(
		(bean: Bean) => () => {
			navigation.navigate(BeanListRoutes.BeanInformation, {beanId: bean.id, beanName: bean.name});
		},
		[],
	);

	function onOpenWebDashboardPressed() {
		const dashboardUrl = API_BASE_URL + '/dashboard';
		Linking.canOpenURL(dashboardUrl).then(supported => {
			if (supported) {
				return Linking.openURL(dashboardUrl);
			} else {
				Alert.alert(`Failed to open ${dashboardUrl}.`);
			}
		});
	}

	function onBeansChanged() {
		setHasBeans(beans && beans.length > 0);
	}

	function refresh() {
		return refreshBean()
			.catch()
			.finally(() => {
				if (mounted) {
					setRefreshing(false);
				}
			});
	}

	useEffect(onBeansChanged, [beans]);

	const renderBeanItem: ListRenderItem<Bean> = ({item: bean}) => (
		<TouchableHighlight
			activeOpacity={0.4}
			underlayColor={applicationColors.light}
			onPress={onBeanItemPressed(bean)}>
			<View style={BeanListScreenStyle.beanItemView}>
				<FastImage
					style={BeanListScreenStyle.beanItemImage}
					resizeMode={FastImage.resizeMode.contain}
					source={{
						uri: API_BASE_URL + bean.image,
						priority: FastImage.priority.high,
					}}
				/>
				<View style={BeanListScreenStyle.beanItemSideView}>
					<Text style={BeanListScreenStyle.beanItemNameText}>{bean.name}</Text>
					<Text style={BeanListScreenStyle.beanItemDescriptionText}>
						{formatValue(bean.inventory.currentGreenBeanWeight, 'gram')} green bean{'\n'}
						{formatValue(bean.inventory.currentRoastedBeanWeight, 'gram')} roasted bean
					</Text>
				</View>
			</View>
		</TouchableHighlight>
	);

	const BeanListFooter: FC = () => (
		<View style={BeanListScreenStyle.flatListFooterView}>
			{hasBeans && (
				<Text style={BeanListScreenStyle.flatListFooterText}>
					{refreshing ? 'Getting beans data...' : "You've reached the end of bean list."}
				</Text>
			)}
		</View>
	);
	const MemoizedBeanListFooter = memo(BeanListFooter);

	const BeanListEmpty: FC = () => (
		<View style={BeanListScreenStyle.flatListEmptyView}>
			{!hasBeans && isLoading ? (
				<Fragment>
					<ActivityIndicator />
					<Text style={BeanListScreenStyle.flatListEmptyHelperText}>Getting beans data..</Text>
				</Fragment>
			) : (
				<Fragment>
					<Text style={BeanListScreenStyle.flatListEmptyTitleText}>It&apos;s empty here...</Text>
					<Text style={BeanListScreenStyle.flatListEmptyHelperText}>
						There&apos;s no bean at the moment.{'\n'}You may add bean through the Web Dashboard.
					</Text>
					<Button style={BeanListScreenStyle.flatListEmptyHelperButton} onPress={onOpenWebDashboardPressed}>
						Open Web Dashboard
					</Button>
				</Fragment>
			)}
		</View>
	);
	const MemoizedBeanListEmpty = memo(BeanListEmpty);

	return (
		<DashboardLayout header={{showBorder: true}}>
			<FlatList
				style={BeanListScreenStyle.flatList}
				contentContainerStyle={BeanListScreenStyle.flatListContentContainer}
				data={beans}
				renderItem={renderBeanItem}
				keyExtractor={bean => bean.id}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} title="Updating information..." />
				}
				ItemSeparatorComponent={() => <Divider style={BeanListScreenStyle.flatListDivider} />}
				ListFooterComponent={MemoizedBeanListFooter}
				ListFooterComponentStyle={BeanListScreenStyle.flatListFooter}
				ListEmptyComponent={MemoizedBeanListEmpty}
			/>
		</DashboardLayout>
	);
};

export default BeanListScreen;
