import React, {FC, Fragment, useCallback, useState} from 'react';
import {ActivityIndicator, Alert, Linking, RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {Button, Card, Divider, Icon, Text} from '@ui-kitten/components';
import {API_BASE_URL} from '@env';
import RoastingCancellationReason from '../../../core/enums/RoastingCancellationReason';
import Role from '../../../core/enums/Role';
import Bean from '../../../core/entities/Bean';
import IncomingGreenBean from '../../../core/entities/IncomingGreenBean';
import RoastingSession from '../../../core/entities/RoastingSession';
import UserRole from '../../../core/entities/UserRole';
import ApplicationLogoImage from '../../../components/ApplicationLogoImage';
import ProfilePicture from '../../../components/ProfilePicture';
import TimeAgo from '../../../components/TimeAgo';
import {createCardHeader} from '../../../libs/components/CardHeader';
import {getGreetingString} from '../../../libs/common/DateHelper';
import {getRoleString} from '../../../libs/common/RoleHelper';
import {formatUnitValue} from '../../../libs/common/UnitHelper';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useInit from '../../../libs/hooks/InitHook';
import useInventory from '../../../libs/hooks/InventoryHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import useProduction from '../../../libs/hooks/ProductionHook';
import ScreenRoutes from '../../ScreenRoutes';
import MainScreenStyle from './MainScreen.style';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import DashboardRoutes from '../DashboardRoutes';

const UnsupportedRoleCard: FC<{userRoles: UserRole[]}> = ({userRoles, ...props}) => {
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

type MainScreenParams = {};
type MainScreenProps = BottomTabScreenProps<MainScreenParams, DashboardRoutes.Main>;

const MainScreen: FC<MainScreenProps> = ({navigation}) => {
	useInit(onInit);
	const {user, refresh: refreshAuthentication} = useAuthentication();
	const logger = useLogger(MainScreen);

	const {list: inventoryList, getBeanById, refresh: refreshInventory} = useInventory();
	const {
		list: productionList,
		ongoing: ongoingProduction,
		hasOngoingProduction,
		refresh: refreshProduction,
	} = useProduction();

	const [greeting, setGreeting] = useState('');
	const [hasRoasterRole, setHasRoasterRole] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	async function onInit() {
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
		const newGreeting = getGreetingString(user.firstName);

		setGreeting(newGreeting);
		setHasRoasterRole(user.roles.findIndex(userRole => userRole.role === Role.Roaster) !== -1);
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

	function renderProductionItem(production: RoastingSession, index: number, list: RoastingSession[]) {
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
				status="primary"
				onPress={() => {}}>
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
			<UnsupportedRoleCard style={MainScreenStyle.unsupportedRoleCard} userRoles={user.roles} />
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
