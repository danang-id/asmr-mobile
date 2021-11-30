import {API_BASE_URL} from '@env';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Button, Card, Divider, Icon, Text} from '@ui-kitten/components';
import React, {FC, Fragment, useCallback, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	Linking,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	View,
	ViewStyle,
} from 'react-native';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import {createCardHeader} from 'asmr/components/CardHeader';
import ProfilePicture from 'asmr/components/ProfilePicture';
import TimeAgo from 'asmr/components/TimeAgo';
import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';
import Roasting from 'asmr/core/entities/Roasting';
import UserRole from 'asmr/core/entities/UserRole';
import RoastingCancellationReason from 'asmr/core/enums/RoastingCancellationReason';
import Role from 'asmr/core/enums/Role';
import useAuthentication from 'asmr/hooks/AuthenticationHook';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useInventory from 'asmr/hooks/InventoryHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useProduction from 'asmr/hooks/ProductionHook';
import {getGreetingString} from 'asmr/libs/common/DateHelper';
import {getRoleString} from 'asmr/libs/common/RoleHelper';
import {formatUnitValue} from 'asmr/libs/common/UnitHelper';
import {DashboardParamList} from 'asmr/screens/Dashboard/DashboardNavigator';
import DashboardRoutes from 'asmr/screens/Dashboard/DashboardRoutes';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import MainScreenStyle from './MainScreen.style';

interface UnsupportedRoleCardProps {
	userRoles: UserRole[];
	style?: ViewStyle;
}
const UnsupportedRoleCard: FC<UnsupportedRoleCardProps> = ({userRoles, ...props}) => {
	const roles = userRoles.map(userRole => getRoleString(userRole.role)).join(' and ');

	function onUseWebDashboardPressed() {
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
		<Card status="warning" header={createCardHeader('Unsupported Roles')} {...props}>
			<Text style={MainScreenStyle.unsupportedRoleText}>
				We are only supporting Roaster role in this mobile application at this moment.{'\n\n'}
				For {roles}, please use the web dashboard.
			</Text>
			<Button onPress={onUseWebDashboardPressed}>Open Web Dashboard</Button>
		</Card>
	);
};

type MainScreenProps = BottomTabScreenProps<DashboardParamList, DashboardRoutes.Main>;
const MainScreen: FC<MainScreenProps> = ({navigation}) => {
	useInitAsync(onInitAsync);
	const {user, refresh: refreshAuthentication} = useAuthentication();
	const logger = useLogger(MainScreen);

	const {list: inventoryList, getBeanById, refresh: refreshInventory} = useInventory();
	const {
		list: productionList,
		ongoing: ongoingProduction,
		hasOngoingProduction,
		refresh: refreshProduction,
	} = useProduction();

	const [greeting, setGreeting] = useState<string>('');
	const [hasRoasterRole, setHasRoasterRole] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);

	async function onInitAsync(): Promise<void> {
		setRefreshing(true);
		onUserDataUpdated();
		await refreshAuthentication();
		await Promise.all([refreshInventory(), refreshProduction()]);
		setRefreshing(false);
	}

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		Promise.all([refreshInventory(), refreshProduction()])
			.catch()
			.finally(() => {
				setRefreshing(false);
			});
	}, []);

	function onUserDataUpdated() {
		const newGreeting = getGreetingString(user?.firstName ?? '');

		setGreeting(newGreeting);
		setHasRoasterRole((user?.roles ?? []).findIndex(userRole => userRole.role === Role.Roaster) !== -1);
		setInitialized(true);

		logger.info(newGreeting);
	}

	function onProductionStatusCardPressed() {
		navigation.navigate(ScreenRoutes.RoastingProcess);
	}

	function onStockHistoryCardPressed() {
		Alert.alert('Full stock history feature is coming soon!');
	}

	function onRoastingHistoryCardPressed() {
		Alert.alert('Full roasting history feature is coming soon!');
	}

	function renderIncomingItem(incoming: IncomingGreenBean, index: number, list: IncomingGreenBean[]) {
		const beanOnFile: Bean | undefined = getBeanById(incoming.beanId);
		const isLastItem = index === list.length - 1;
		return (
			<Fragment key={index}>
				<View style={MainScreenStyle.stockItemView}>
					<Icon style={MainScreenStyle.stockItemIcon} name="add-circle-outline" pack="ion" />
					<View style={MainScreenStyle.stockItemSideView}>
						<Text style={MainScreenStyle.stockItemBeanNameText}>{beanOnFile?.name ?? ''}</Text>
						<Text style={MainScreenStyle.stockItemWeightText}>
							{formatUnitValue(incoming.weightAdded, 'gram')}
						</Text>
						<Text style={MainScreenStyle.stockItemCreatedText}>
							Added <TimeAgo date={incoming.createdAt} locale="en-US" />
						</Text>
					</View>
				</View>
				{!isLastItem && <Divider />}
			</Fragment>
		);
	}

	function renderProductionItem(production: Roasting, index: number, list: Roasting[]) {
		const beanOnFile: Bean | undefined = getBeanById(production.beanId);
		const isLastItem = index === list.length - 1;
		return (
			<Fragment key={index}>
				<View style={MainScreenStyle.roastingItemView}>
					<Icon
						style={MainScreenStyle.roastingItemIcon}
						name={
							production.finishedAt
								? 'checkmark-circle-outline'
								: production.cancelledAt
								? 'close-circle-outline'
								: 'sync-circle-outline'
						}
						pack="ion"
					/>
					<View style={MainScreenStyle.roastingItemSideView}>
						<Text style={MainScreenStyle.roastingItemBeanNameText}>{beanOnFile?.name ?? ''}</Text>
						{production.finishedAt ? (
							<Fragment>
								<Text style={MainScreenStyle.roastingItemWeightText}>
									{formatUnitValue(production.greenBeanWeight, 'gram')} [G] →{' '}
									{formatUnitValue(production.roastedBeanWeight, 'gram')} [R]
								</Text>
								<Text style={MainScreenStyle.roastingItemCreatedText}>
									Finished <TimeAgo date={production.finishedAt} locale="en-US" />
								</Text>
							</Fragment>
						) : production.cancelledAt ? (
							<Fragment>
								<Text style={MainScreenStyle.roastingItemWeightText}>
									{formatUnitValue(production.greenBeanWeight, 'gram')} [G] →{' '}
									{production.cancellationReason === RoastingCancellationReason.RoastingFailure
										? formatUnitValue(production.roastedBeanWeight, 'gram') + ' [R]'
										: formatUnitValue(production.greenBeanWeight, 'gram') + ' [G]'}
								</Text>
								<Text style={MainScreenStyle.roastingItemCreatedText}>
									Cancelled <TimeAgo date={production.cancelledAt} locale="en-US" />
								</Text>
							</Fragment>
						) : (
							<Fragment>
								<Text style={MainScreenStyle.roastingItemWeightText}>
									{formatUnitValue(production.greenBeanWeight, 'gram')} [G]
								</Text>
								<Text style={MainScreenStyle.roastingItemCreatedText}>
									Started <TimeAgo date={production.createdAt} locale="en-US" />
								</Text>
							</Fragment>
						)}
					</View>
				</View>
				{!isLastItem && <Divider />}
			</Fragment>
		);
	}

	const SupportedView: FC = () => (
		<View>
			{!refreshing && hasOngoingProduction() && (
				<Card
					style={MainScreenStyle.productionStatusCard}
					appearance="outline"
					status="info"
					onPress={onProductionStatusCardPressed}>
					<View style={MainScreenStyle.productionStatusHeaderView}>
						<Icon style={MainScreenStyle.productionStatusIcon} name="sync-outline" pack="ion" />
						<View style={MainScreenStyle.productionStatusSideView}>
							<Text style={MainScreenStyle.productionStatusCurrentlyRoastingText}>
								Currently roasting
							</Text>
							<Text style={MainScreenStyle.productionStatusBeanNameText}>
								{ongoingProduction?.bean?.name ?? ''}
							</Text>
							<Text style={MainScreenStyle.productionStatusBeanWeightText}>
								{formatUnitValue(ongoingProduction?.production?.greenBeanWeight ?? 0, 'gram')} of green
								bean
							</Text>
						</View>
					</View>
					<View style={MainScreenStyle.productionStatusFooterView}>
						<Text style={MainScreenStyle.productionStatusCreatedText}>
							Started <TimeAgo date={ongoingProduction?.production?.createdAt ?? new Date()} />
						</Text>
						<Text style={MainScreenStyle.productionViewProgressText}>View Progress ▶</Text>
					</View>
				</Card>
			)}
			<Card
				style={MainScreenStyle.stockHistoryCard}
				header={createCardHeader('Green Bean Stock History', 'green beans you have added to the inventory')}
				appearance="outline"
				status="primary"
				onPress={onStockHistoryCardPressed}>
				{refreshing ? (
					<ActivityIndicator />
				) : inventoryList && inventoryList.length > 0 ? (
					<Fragment>
						{inventoryList.slice(0, 4).map(renderIncomingItem)}
						<Text style={MainScreenStyle.moreStockHistoryText}>More Stock History ▶</Text>
					</Fragment>
				) : (
					<Text style={MainScreenStyle.stockHistoryEmptyText}>
						You have never added any green beans to the inventory yet.
					</Text>
				)}
			</Card>
			<Card
				style={MainScreenStyle.roastingHistoryCard}
				header={createCardHeader('Roasting History', 'green beans you have roasted')}
				appearance="outline"
				status="primary"
				onPress={onRoastingHistoryCardPressed}>
				{refreshing ? (
					<ActivityIndicator />
				) : productionList && productionList.length > 0 ? (
					<Fragment>
						{productionList.slice(0, 4).map(renderProductionItem)}
						<Text style={MainScreenStyle.moreRoastingHistoryText}>More Roasting History ▶</Text>
					</Fragment>
				) : (
					<Text style={MainScreenStyle.roastingHistoryEmptyText}>
						You have never roasted any green beans yet.
					</Text>
				)}
			</Card>
			<Card
				style={MainScreenStyle.packagingHistoryCard}
				header={createCardHeader('Packaging History', 'roasted beans you have packaged')}
				appearance="outline"
				status="primary">
				{refreshing ? (
					<ActivityIndicator />
				) : [].length > 0 ? (
					<Fragment>
						{[].slice(0, 4).map(renderProductionItem)}
						<Text style={MainScreenStyle.morePackagingHistoryText}>More Packaging History ▶</Text>
					</Fragment>
				) : (
					<Text style={MainScreenStyle.packagingHistoryEmptyText}>
						You have never packaged any roasted beans yet.
					</Text>
				)}
			</Card>
		</View>
	);

	const MainContent = () =>
		!hasRoasterRole ? (
			<UnsupportedRoleCard style={MainScreenStyle.unsupportedRoleCard} userRoles={user?.roles ?? []} />
		) : (
			<SupportedView />
		);

	return (
		<SafeAreaView style={MainScreenStyle.container}>
			<ScrollView
				style={MainScreenStyle.scrollView}
				contentContainerStyle={MainScreenStyle.scrollViewContentContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} title="Refreshing information..." />
				}>
				<View style={MainScreenStyle.headerView}>
					<View>
						<ApplicationLogoImage style={MainScreenStyle.appTitleImage} />
						<ProfilePicture size={50} />
					</View>
					<Text style={MainScreenStyle.greetingText} status="primary">
						{greeting}
					</Text>
				</View>
				{initialized && <MainContent />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default MainScreen;
