import {API_BASE_URL} from '@env';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Card, Divider, Icon, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useCallback, useEffect, useState} from 'react';
import {Alert, Linking, RefreshControl, ScrollView, TouchableOpacity, View, ViewStyle} from 'react-native';
import CardHeader from 'asmr/components/CardHeader';
import ShimmerPlaceholder from 'asmr/components/ShimmerPlaceholder';
import TimeAgo from 'asmr/components/TimeAgo';
import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';
import Roasting from 'asmr/core/entities/Roasting';
import UserRole from 'asmr/core/entities/UserRole';
import RoastingCancellationReason from 'asmr/core/enums/RoastingCancellationReason';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/authentication.hook';
import useInventory from 'asmr/hooks/inventory.hook';
import useMounted from 'asmr/hooks/mounted.hook';
import useProduction from 'asmr/hooks/production.hook';
import useRefresh from 'asmr/hooks/refresh.hook';
import DashboardLayout from 'asmr/layouts/DashboardLayout';
import {formatValue} from 'asmr/libs/common/Intl.helper';
import {getRoleString} from 'asmr/libs/common/Role.helper';
import {DashboardParamList} from 'asmr/screens/Dashboard/DashboardNavigator';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import HomeScreenStyle from './HomeScreen.style';

interface RoleNotSupportedViewProps {
	userRoles: UserRole[];
	style?: ViewStyle;
}
const RoleNotSupportedView: FC<RoleNotSupportedViewProps> = ({userRoles, style, ...props}) => {
	const roles = userRoles.map(userRole => getRoleString(userRole.role)).join(' and ');

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

	return (
		<Card
			status="warning"
			style={[HomeScreenStyle.baseCard, HomeScreenStyle.unsupportedRoleCard, style]}
			{...props}>
			<Text style={HomeScreenStyle.unsupportedRoleText}>
				We are only supporting Roaster role in this mobile application at this moment.{'\n\n'}
				For {roles}, please use the web dashboard.
			</Text>
			<Button onPress={onOpenWebDashboardPressed}>Open Web Dashboard</Button>
		</Card>
	);
};

type HomeScreenProps = BottomTabScreenProps<DashboardParamList, DashboardRoutes.Home>;
const HomeScreen: FC<HomeScreenProps> = ({navigation}) => {
	const mounted = useMounted(HomeScreen);
	const {user, isAuthorized} = useAuthentication();
	const {list: inventoryList, getBeanById, refresh: refreshInventory} = useInventory();
	const {
		list: productionList,
		ongoing: ongoingProduction,
		hasOngoingProduction,
		refresh: refreshProduction,
	} = useProduction();

	const [refreshing, refresh] = useRefresh([refreshInventory, refreshProduction]);
	const onRefresh = useCallback(refresh, []);

	const [hasInventory, setHasInventory] = useState<boolean>(false);
	const [hasProduction, setHasProduction] = useState<boolean>(false);
	const [hasPackaging, setHasPackaging] = useState<boolean>(false);

	function onProductionStatusCardPressed() {
		navigation.navigate(ScreenRoutes.Roasting);
	}

	function onStockHistoryCardPressed() {
		Alert.alert('Full stock history feature is coming soon!');
	}

	function onRoastingHistoryCardPressed() {
		Alert.alert('Full roasting history feature is coming soon!');
	}

	function onPackagingHistoryCardPressed() {
		Alert.alert('Full packaging history feature is coming soon!');
	}

	function onInventoryChanged() {
		setHasInventory(inventoryList && inventoryList.length > 0);
	}

	function onProductionChanged() {
		setHasProduction(productionList && productionList.length > 0);
	}

	function onPackagingChanged() {
		setHasPackaging(false);
	}

	useEffect(onInventoryChanged, [inventoryList]);
	useEffect(onProductionChanged, [productionList]);
	useEffect(onPackagingChanged, []);

	const ProductionCard: FC = () => {
		if (!hasOngoingProduction() || !ongoingProduction?.production || !ongoingProduction.bean) {
			return <Fragment />;
		}

		const now = new Date();
		const startedAt = new Date(ongoingProduction.production.createdAt);
		const dayDelta = now.getDate() - startedAt.getDate();
		const nowHour = now.getHours() + dayDelta * 24;
		const hourDelta = nowHour - startedAt.getHours();

		return (
			<Card
				style={[HomeScreenStyle.baseCard, HomeScreenStyle.productionStatusCard]}
				appearance="outline"
				status="info">
				<TouchableOpacity onPress={onProductionStatusCardPressed}>
					<View style={HomeScreenStyle.productionStatusHeaderView}>
						<Icon style={HomeScreenStyle.productionStatusIcon} name="sync-outline" pack="ion" />
						<View style={HomeScreenStyle.productionStatusSideView}>
							<Text style={HomeScreenStyle.productionStatusCurrentlyRoastingText}>
								You are currently roasting
							</Text>
							<Text style={HomeScreenStyle.productionStatusBeanNameText}>
								{ongoingProduction.bean.name}
							</Text>
							<Text style={HomeScreenStyle.productionStatusBeanWeightText}>
								using {formatValue(ongoingProduction.production.greenBeanWeight, 'gram')} of green bean
							</Text>
							{hourDelta >= 18 && (
								<Text style={HomeScreenStyle.productionStatusTimeoutWarningText} status="warning">
									<Text
										style={[
											HomeScreenStyle.productionStatusTimeoutWarningText,
											{fontWeight: 'bold'},
										]}
										status="warning">
										WARNING:{'\n'}
									</Text>
									Your current roasting progress will be assumed as roasting failure and will be
									terminated automatically after 24 hours.
								</Text>
							)}
						</View>
					</View>
					<View style={HomeScreenStyle.productionStatusFooterView}>
						<Text style={HomeScreenStyle.productionStatusCreatedText}>
							Started <TimeAgo date={startedAt} />
						</Text>
						<Text style={HomeScreenStyle.productionViewProgressText}>View Progress ▶</Text>
					</View>
				</TouchableOpacity>
			</Card>
		);
	};

	const StockHistoryCard: FC = () => {
		function renderInventoryItem(incoming: IncomingGreenBean, index: number, list: IncomingGreenBean[]) {
			const beanOnFile: Bean | undefined = getBeanById(incoming.beanId);
			const isLastItem = index === list.length - 1;
			return (
				<Fragment key={index}>
					<View style={HomeScreenStyle.stockItemView}>
						<Icon style={HomeScreenStyle.stockItemIcon} name="add-circle-outline" pack="ion" />
						<View style={HomeScreenStyle.stockItemSideView}>
							<Text style={HomeScreenStyle.stockItemBeanNameText}>{beanOnFile?.name ?? ''}</Text>
							<Text style={HomeScreenStyle.stockItemWeightText}>
								{formatValue(incoming.weightAdded, 'gram')} [GB]
							</Text>
							<Text style={HomeScreenStyle.stockItemCreatedText}>
								Added <TimeAgo date={new Date(incoming.createdAt)} locale="en-US" />
							</Text>
						</View>
					</View>
					{!isLastItem && <Divider />}
				</Fragment>
			);
		}

		return (
			<Card
				style={[HomeScreenStyle.baseCard, HomeScreenStyle.stockHistoryCard]}
				header={
					<CardHeader
						title="Stock History"
						information="This card is showing the list of green beans you have added to the inventory."
					/>
				}
				appearance="outline"
				status="primary">
				<ShimmerPlaceholder visible={!refreshing || hasInventory}>
					<TouchableOpacity onPress={onStockHistoryCardPressed}>
						{hasInventory ? (
							<Fragment>
								{inventoryList.slice(0, 4).map(renderInventoryItem)}
								<Text style={HomeScreenStyle.moreStockHistoryText}>More Stock History ▶</Text>
							</Fragment>
						) : (
							<Text style={HomeScreenStyle.stockHistoryEmptyText}>
								You have never added any green beans to the inventory yet.
							</Text>
						)}
					</TouchableOpacity>
				</ShimmerPlaceholder>
			</Card>
		);
	};

	const RoastingHistoryCard: FC = () => {
		function renderProductionItem(production: Roasting, index: number, list: Roasting[]) {
			const beanOnFile: Bean | undefined = getBeanById(production.beanId);
			const isLastItem = index === list.length - 1;

			if (production.finishedAt) {
				production.finishedAt = new Date(production.finishedAt);
			}
			if (production.cancelledAt) {
				production.cancelledAt = new Date(production.cancelledAt);
			}

			const isProductionOngoing =
				!production.finishedAt &&
				!production.cancelledAt &&
				production.cancellationReason == RoastingCancellationReason.NotCancelled;
			const isProductionFinished =
				!!production.finishedAt &&
				!production.cancelledAt &&
				production.cancellationReason == RoastingCancellationReason.NotCancelled;
			const isWrongDataSubmitted =
				!production.finishedAt &&
				!!production.cancelledAt &&
				production.cancellationReason == RoastingCancellationReason.WrongRoastingDataSubmitted;
			const isRoastingFailed =
				!production.finishedAt &&
				!!production.cancelledAt &&
				production.cancellationReason == RoastingCancellationReason.RoastingFailure;
			const isRoastingTimeout =
				!production.finishedAt &&
				!!production.cancelledAt &&
				production.cancellationReason == RoastingCancellationReason.RoastingTimeout;

			let iconName: string;
			if (isProductionOngoing) {
				iconName = 'sync-circle-outline';
			} else if (isProductionFinished) {
				iconName = 'checkmark-circle-outline';
			} else if (isWrongDataSubmitted) {
				iconName = 'chevron-back-circle-outline';
			} else if (isRoastingTimeout) {
				iconName = 'time-outline';
			} else {
				iconName = 'close-circle-outline';
			}

			return (
				<Fragment key={index}>
					<View style={HomeScreenStyle.roastingItemView}>
						<Icon style={HomeScreenStyle.roastingItemIcon} name={iconName} pack="ion" />
						<View style={HomeScreenStyle.roastingItemSideView}>
							<Text style={HomeScreenStyle.roastingItemBeanNameText}>{beanOnFile?.name ?? ''}</Text>
							{isProductionOngoing && (
								<Fragment>
									<Text style={HomeScreenStyle.roastingItemWeightText} status="info">
										{formatValue(production.greenBeanWeight, 'gram')} [GB]
									</Text>
									<Text style={HomeScreenStyle.roastingItemCreatedText}>
										Started <TimeAgo date={production.createdAt} locale="en-US" />
									</Text>
								</Fragment>
							)}
							{isProductionFinished && (
								<Fragment>
									<Text style={HomeScreenStyle.roastingItemWeightText} status="success">
										{formatValue(production.greenBeanWeight, 'gram')} [GB] →{' '}
										{formatValue(production.roastedBeanWeight, 'gram')} [RB]
									</Text>
									<Text style={HomeScreenStyle.roastingItemCreatedText}>
										Finished <TimeAgo date={production.finishedAt as Date} locale="en-US" />
									</Text>
								</Fragment>
							)}
							{isWrongDataSubmitted && (
								<Fragment>
									<Text style={HomeScreenStyle.roastingItemWeightText} status="warning">
										{formatValue(production.greenBeanWeight, 'gram')} [GB] →{' '}
										{formatValue(production.greenBeanWeight, 'gram') + ' [GB]'}
									</Text>
									<Text style={HomeScreenStyle.roastingItemCreatedText}>
										Cancelled <TimeAgo date={production.cancelledAt as Date} locale="en-US" />
									</Text>
								</Fragment>
							)}
							{isRoastingFailed && (
								<Fragment>
									<Text style={HomeScreenStyle.roastingItemWeightText} status="danger">
										{formatValue(production.greenBeanWeight, 'gram')} [GB] →{' '}
										{formatValue(production.roastedBeanWeight, 'gram') + ' [RB]'}
									</Text>
									<Text style={HomeScreenStyle.roastingItemCreatedText}>
										Failed <TimeAgo date={production.cancelledAt as Date} locale="en-US" />
									</Text>
								</Fragment>
							)}
							{isRoastingTimeout && (
								<Fragment>
									<Text style={HomeScreenStyle.roastingItemWeightText} status="danger">
										{formatValue(production.greenBeanWeight, 'gram')} [GB] →{' '}
										{formatValue(production.roastedBeanWeight, 'gram') + ' [RB]'}
									</Text>
									<Text style={HomeScreenStyle.roastingItemCreatedText}>
										Failed automatically{' '}
										<TimeAgo date={production.cancelledAt as Date} locale="en-US" />
									</Text>
								</Fragment>
							)}
						</View>
					</View>
					{!isLastItem && <Divider />}
				</Fragment>
			);
		}

		return (
			<Card
				style={[HomeScreenStyle.baseCard, HomeScreenStyle.roastingHistoryCard]}
				header={
					<CardHeader
						title="Roasting History"
						information={
							'This card is showing the list of roasting process you have started, including the ' +
							'bean used, the produced bean, the status of the roasting, and the time you ran the roasting.'
						}
					/>
				}
				appearance="outline"
				status="primary">
				<ShimmerPlaceholder visible={!refreshing || hasProduction}>
					<TouchableOpacity onPress={onRoastingHistoryCardPressed}>
						{hasProduction ? (
							<Fragment>
								{productionList.slice(0, 4).map(renderProductionItem)}
								<Text style={HomeScreenStyle.moreRoastingHistoryText}>More Roasting History ▶</Text>
							</Fragment>
						) : (
							<Text style={HomeScreenStyle.roastingHistoryEmptyText}>
								You have never roasted any green beans yet.
							</Text>
						)}
					</TouchableOpacity>
				</ShimmerPlaceholder>
			</Card>
		);
	};

	const PackagingHistoryCard: FC = () => {
		return (
			<Card
				style={[HomeScreenStyle.baseCard, HomeScreenStyle.packagingHistoryCard]}
				header={
					<CardHeader
						title="Packaging History"
						information="The card is showing the list of roasted beans you have packaged into sellable products."
					/>
				}
				appearance="outline"
				status="primary">
				<ShimmerPlaceholder visible={!refreshing || hasPackaging}>
					<TouchableOpacity onPress={onPackagingHistoryCardPressed}>
						{hasPackaging ? (
							<Fragment>
								<Text style={HomeScreenStyle.morePackagingHistoryText}>More Packaging History ▶</Text>
							</Fragment>
						) : (
							<Text style={HomeScreenStyle.packagingHistoryEmptyText}>
								You have never packaged any roasted beans yet.
							</Text>
						)}
					</TouchableOpacity>
				</ShimmerPlaceholder>
			</Card>
		);
	};

	if (!isAuthorized([Role.Roaster])) {
		return (
			<DashboardLayout header={{showGreeting: true}} contentContainerStyle={HomeScreenStyle.contentContainer}>
				<RoleNotSupportedView userRoles={user?.roles ?? []} />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout
			header={{showGreeting: true}}
			contentContainerStyle={HomeScreenStyle.contentContainer}
			scrollable>
			<ScrollView
				style={HomeScreenStyle.scrollView}
				contentContainerStyle={HomeScreenStyle.scrollViewContentContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} title="Updating information..." />
				}>
				<ProductionCard />
				<StockHistoryCard />
				<RoastingHistoryCard />
				<PackagingHistoryCard />
			</ScrollView>
		</DashboardLayout>
	);
};

export default HomeScreen;
