import React, {FC, useCallback, useEffect, useState} from 'react';
import {Alert, Linking, RefreshControl, SafeAreaView, ScrollView, View} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import {API_BASE_URL} from '@env';
import UserRole from '../../../core/entities/UserRole';
import Role from '../../../core/enums/Role';
import AppTitleImage from '../../../components/AppTitleImage';
import {createCardHeader} from '../../../libs/common/CardHeader';
import {getRoleString} from '../../../libs/common/Helpers';
import useInit from '../../../libs/hooks/InitHook';
import useAuthentication from '../../../libs/hooks/AuthenticationHook';
import MainScreenStyle from './MainScreen.style';
import useServices from '../../../libs/hooks/ServiceHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import RoastedBeanProduction from '../../../core/entities/RoastedBeanProduction';

const UnsupportedRoleCard: FC<{userRoles: UserRole[]}> = ({userRoles, ...props}) => {
	const [roles, setRoles] = useState('other roles');

	function onUseWebDashboardPressed() {
		Linking.canOpenURL(API_BASE_URL).then(supported => {
			if (supported) {
				return Linking.openURL(API_BASE_URL);
			} else {
				Alert.alert(`Failed to open ${API_BASE_URL}.`);
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
	const {user, updateUserData} = useAuthentication();
	const logger = useLogger(MainScreen);
	const {handleError, handleErrors, bean, production} = useServices();

	const [currentBean, setCurrentBean] = useState();
	const [currentProduction, setCurrentProduction] = useState();
	const [greetingText, setGreetingText] = useState('');
	const [hasRoasterRole, setHasRoasterRole] = useState(false);
	const [initialized, setInitialized] = useState(false);
	const [roastedBeanProductions, setRoastedBeanProductions] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	async function onInit() {
		onUserDataUpdated();
		await updateProductionList();
		await updateUserData();
	}

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		updateProductionList().then();
	}, []);

	function onUserDataUpdated() {
		let newGreetingText = '';
		const date = new Date();
		const hour = date.getHours();
		if (hour < 12) {
			newGreetingText += 'Good morning, ';
		} else if (hour >= 12 && hour <= 17) {
			newGreetingText += 'Good afternoon, ';
		} else if (hour >= 17 && hour <= 24) {
			newGreetingText += 'Good evening, ';
		}
		newGreetingText += user.firstName + '!';
		setGreetingText(newGreetingText);
		setHasRoasterRole(user.roles.findIndex(userRole => userRole.role === Role.Roaster) !== -1);
		setInitialized(true);
	}

	function onRoastedBeanProductionsUpdated() {
		setCurrentProduction(
			roastedBeanProductions.find((p: RoastedBeanProduction) => !p.isFinalized && !p.isCancelled),
		);
		setRefreshing(false);
	}

	function onCurrentProductionUpdated() {
		if (currentProduction) {
			getBean(currentProduction.beanId).then();
		}
	}

	async function updateProductionList() {
		try {
			const result = await production.getAll();
			if (result.isSuccess && result.data) {
				setRoastedBeanProductions(result.data);
				return;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	async function getBean(beanId: string) {
		try {
			const result = await bean.getById(beanId);
			if (result.isSuccess && result.data) {
				setCurrentBean(result.data);
				return;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	useEffect(onUserDataUpdated, [user]);

	useEffect(onRoastedBeanProductionsUpdated, [roastedBeanProductions]);

	useEffect(onCurrentProductionUpdated, [currentProduction]);

	const SupportedView: FC = () => (
		<View>
			<Card style={MainScreenStyle.productionStatusCard}>
				{currentProduction && currentBean ? (
					<Text category="s1" status="info">
						You are now roasting {currentProduction.greenBeanWeight} gram(s) of {currentBean.name} bean.
					</Text>
				) : (
					<View>
						<Text category="s1" status="info">
							You are not roasting any beans at the moment.
						</Text>
					</View>
				)}
			</Card>
			<Card
				style={MainScreenStyle.productionHistoryCard}
				status="primary"
				header={createCardHeader('Roasting History', 'list of beans you have roasted')}>
				{roastedBeanProductions && roastedBeanProductions.length > 0 ? (
					<Text>You tried to roast beans {roastedBeanProductions.length} times.</Text>
				) : (
					<Text>
						You have never roasted any beans yet.{'\n\n'}
						Try to roast a bean!
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
					<AppTitleImage style={MainScreenStyle.appTitleImage} />
					<Text style={MainScreenStyle.greetingText} status="primary">
						{greetingText}
					</Text>
				</View>
				{initialized && <MainContent />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default MainScreen;
