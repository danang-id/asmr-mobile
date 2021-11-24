import React, {FC, Fragment, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Linking, RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import {API_BASE_URL} from '@env';
import Role from '../../../core/enums/Role';
import IncomingGreenBean from '../../../core/entities/IncomingGreenBean';
import RoastedBeanProduction from '../../../core/entities/RoastedBeanProduction';
import UserRole from '../../../core/entities/UserRole';
import ApplicationLogoImage from '../../../components/ApplicationLogoImage';
import {createCardHeader} from '../../../libs/components/CardHeader';
import {getGreetingString} from '../../../libs/common/DateHelper';
import {getRoleString} from '../../../libs/common/RoleHelper';
import {formatUnitValue} from '../../../libs/common/UnitHelper';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import useInit from '../../../libs/hooks/InitHook';
import useInventory from '../../../libs/hooks/InventoryHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import useProduction from '../../../libs/hooks/ProductionHook';
import useProgress from '../../../libs/hooks/ProgressHook';
import MainScreenStyle from './MainScreen.style';

const UnsupportedRoleCard: FC<{userRoles: UserRole[]}> = ({userRoles, ...props}) => {
	const [roles, setRoles] = useState('other roles');

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

	useEffect(() => {
		if (userRoles && Array.isArray(userRoles) && userRoles.length > 0) {
			setRoles(userRoles.map(userRole => getRoleString(userRole.role)).join(' and '));
		}
	}, [userRoles]);

	return (
		<Card status="warning" header={createCardHeader('Unsupported Roles')} {...props}>
			<Text style={MainScreenStyle.unsupportedRoleText}>
				We are only supporting Roaster role in this mobile application at this moment.{'\n\n'}
				For {roles}, please use the web dashboard.
			</Text>
			<Button onPress={onUseWebDashboardPressed}>Use Web Dashboard</Button>
		</Card>
	);
};

const MainScreen: FC = () => {
	useInit(onInit);
	const {user, refresh: refreshAuthentication} = useAuthentication();
	const logger = useLogger(MainScreen);
	const [progress] = useProgress();

	const {list: inventoryList, getBeanById, refresh: refreshInventory} = useInventory();
	const {
		list: productionList,
		ongoing: ongoingProduction,
		hasOngoingProduction,
		finalize: finalizeProduction,
		cancel: cancelProduction,
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

	function onCancelRoastingButtonPressed() {
		Alert.alert(
			'Cancel Roasting',
			'Do you really want to cancel the roasting process of ' +
				`${formatUnitValue(ongoingProduction.production.greenBeanWeight, 'gram')} of ` +
				`${ongoingProduction.bean.name} bean?`,
			[
				{
					style: 'destructive',
					text: 'Yes, cancel roasting',
					onPress: () => {
						cancelProduction().catch();
					},
				},
				{
					style: 'default',
					text: 'No',
				},
			],
		);
	}

	function onFinishRoastingButtonPressed() {
		Alert.alert(
			'Finish Roasting',
			`Is the roasting of ${formatUnitValue(ongoingProduction.production.greenBeanWeight, 'gram')} of ` +
				`${ongoingProduction.bean.name} bean already finished?`,
			[
				{
					style: 'destructive',
					text: 'Not yet finished',
				},
				{
					style: 'default',
					text: 'Roasting is done',
					onPress: () => {
						Alert.alert('Feature coming soon!');
					},
				},
			],
		);
	}

	function onMoreStockHistoryPressed() {
		Alert.alert('Complete stock history feature is coming soon!');
	}

	function onMoreRoastingHistoryPressed() {
		Alert.alert('Complete roasting history feature is coming soon!');
	}

	const SupportedView: FC = () => (
		<View>
			{!refreshing && hasOngoingProduction() && (
				<Card style={MainScreenStyle.productionStatusCard} status="info">
					<Text style={MainScreenStyle.productionStatusText}>
						Currently roasting {formatUnitValue(ongoingProduction.production.greenBeanWeight, 'gram')} of{' '}
						{ongoingProduction.bean.name} bean
					</Text>
					<Text style={MainScreenStyle.productionFinishText}>
						If you have finished the roasting process, please tap Finish. To cancel this roasting process,
						please tap Cancel.
					</Text>
					<View style={MainScreenStyle.productionActionView}>
						<Button
							style={MainScreenStyle.productionCancelButton}
							status="danger"
							onPress={onCancelRoastingButtonPressed}>
							Cancel
						</Button>
						<Button
							style={MainScreenStyle.productionFinishButton}
							status="success"
							onPress={onFinishRoastingButtonPressed}>
							Finish
						</Button>
					</View>
				</Card>
			)}
			<Card
				style={MainScreenStyle.stockHistoryCard}
				status="primary"
				header={createCardHeader('Stock History', 'list of beans you added to the inventory')}>
				{refreshing ? (
					<ActivityIndicator />
				) : inventoryList && inventoryList.length > 0 ? (
					<Fragment>
						{inventoryList.slice(0, 4).map((incoming: IncomingGreenBean, index) => (
							<Text style={MainScreenStyle.stockText} key={index}>
								Added {formatUnitValue(incoming.weightAdded, 'gram')} of{' '}
								{getBeanById(incoming.beanId)?.name} bean.
							</Text>
						))}
						{inventoryList.length > 5 && (
							<Text style={MainScreenStyle.moreStockText} onPress={onMoreStockHistoryPressed}>
								More stock history >
							</Text>
						)}
					</Fragment>
				) : (
					<Text style={MainScreenStyle.stockText}>You have never added any beans to the inventory yet.</Text>
				)}
			</Card>
			<Card
				style={MainScreenStyle.roastingHistoryCard}
				status="primary"
				header={createCardHeader('Roasting History', 'list of beans you have roasted')}>
				{refreshing ? (
					<ActivityIndicator />
				) : productionList && productionList.length > 0 ? (
					<Fragment>
						{productionList.slice(0, 4).map((production: RoastedBeanProduction, index) => (
							<Text style={MainScreenStyle.roastingText} key={index}>
								{production.isFinalized
									? '[FINISHED]'
									: production.isCancelled
									? '[CANCELLED]'
									: '[ON PROGRESS]'}{' '}
								Roasting of {formatUnitValue(production.greenBeanWeight, 'gram')} of{' '}
								{getBeanById(production.beanId)?.name} bean.
							</Text>
						))}
						{productionList.length > 5 && (
							<Text style={MainScreenStyle.moreRoastingText} onPress={onMoreRoastingHistoryPressed}>
								More roasting history >
							</Text>
						)}
					</Fragment>
				) : (
					<Text style={MainScreenStyle.roastingText}>You have never roasted any beans yet.</Text>
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
					<ApplicationLogoImage style={MainScreenStyle.appTitleImage} />
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
