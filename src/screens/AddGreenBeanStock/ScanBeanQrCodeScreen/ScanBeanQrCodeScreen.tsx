// noinspection DuplicatedCode
import {API_BASE_URL, GLEAP_TOKEN} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, ListRenderItem, Platform, View} from 'react-native';
import Gleap from 'react-native-gleapsdk';
import {
	check as checkPermission,
	request as requestPermission,
	openSettings,
	Permission,
} from 'react-native-permissions';
import {PERMISSIONS} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import CodeScanner, {CameraConstants, CodeScannedEvent} from 'asmr/components/CodeScanner';
import Bean from 'asmr/core/entities/Bean';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import {useInit, useInitAsync} from 'asmr/hooks/InitHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useServices from 'asmr/hooks/ServiceHook';
import {PermissionStepInfo, CameraPermissionSteps} from 'asmr/libs/common/PermissionHelper';
import {AddGreenBeanStockParamList} from 'asmr/screens/AddGreenBeanStock/AddGreenBeanStockNavigator';
import AddGreenBeanStockRoutes from 'asmr/screens/AddGreenBeanStock/AddGreenBeanStockRoutes';
import ScanBeanQrCodeScreenStyle from './ScanBeanQrCodeScreen.style';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';

type ScanIncomingGreenBeanScreenProps = NativeStackScreenProps<
	AddGreenBeanStockParamList,
	AddGreenBeanStockRoutes.ScanGreenBeanQrCode
>;
const ScanBeanQrCodeScreen: FC<ScanIncomingGreenBeanScreenProps> = ({navigation}) => {
	useInit(onInit);
	useInitAsync(onInitAsync);
	const logger = useLogger(ScanBeanQrCodeScreen);
	const {handleError, handleErrors, bean: beanService} = useServices();

	const [bean, setBean] = useState<Bean | undefined>();
	const [beanId, setBeanId] = useState<string | undefined>();
	const [cameraUseAllowed, setCameraUseAllowed] = useState<boolean>(false);
	const scannerRef = useRef<QRCodeScanner>(null);

	function onInit() {
		navigation.addListener('focus', onNavigationFocus);
		return () => {
			navigation.removeListener('focus', onNavigationFocus);
		};
	}

	async function onInitAsync(): Promise<void> {
		let permission: Permission;
		if (Platform.OS === 'android') {
			permission = PERMISSIONS.ANDROID.CAMERA;
		} else if (Platform.OS === 'ios') {
			permission = PERMISSIONS.IOS.CAMERA;
		} else {
			return;
		}

		let status = await checkPermission(permission);
		if (status !== 'granted') {
			status = await requestPermission(permission);
		}

		setCameraUseAllowed(status === 'granted');
		logger.info(permission, status);
		if (GLEAP_TOKEN) {
			Gleap.logEvent('Camera permission request', {status});
		}
	}

	function onNavigationFocus() {
		setBeanId(undefined);
		scannerRef.current?.reactivate();
	}

	function onQrCodeRead(event: CodeScannedEvent) {
		const qrCodeData = event.data ?? '';
		if (!qrCodeData.startsWith(beanPublicationUrl)) {
			showAlert('Invalid QR Code', () => {
				scannerRef?.current?.reactivate();
			});
			return;
		}

		setBeanId(qrCodeData.substring(beanPublicationUrl.length));
	}

	function onBeanIdChanged() {
		if (!beanId) {
			setBean(undefined);
			return;
		}

		getBean().catch();
	}

	function onBeanChanged() {
		if (!bean) {
			return;
		}

		navigation.navigate(AddGreenBeanStockRoutes.ConfirmBeanWeightScreen, {bean});
	}

	async function getBean() {
		try {
			const result = await beanService.getById(beanId ?? '');
			if (result.isSuccess && result.data) {
				setBean(result.data);
				return;
			}

			if (result.errors) {
				if (result.errors.findIndex(e => e.code === ErrorCode.ResourceNotFound) !== -1) {
					showAlert('The bean you just scanned have been removed from the system.', () => {
						scannerRef?.current?.reactivate();
					});
					return;
				}

				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	function showAlert(message: string, onTryAgain?: () => void) {
		Alert.alert(message, undefined, [
			{
				style: 'destructive',
				text: 'Cancel',
				onPress: () => {
					navigation.goBack();
				},
			},
			{
				style: 'default',
				text: 'Try Again',
				onPress: onTryAgain,
			},
		]);
	}

	useEffect(onBeanIdChanged, [beanId]);
	useEffect(onBeanChanged, [bean]);

	const TopContent: FC = () => (
		<View style={ScanBeanQrCodeScreenStyle.topContent}>
			{cameraUseAllowed && (
				<Text category="h6" style={ScanBeanQrCodeScreenStyle.topContentText}>
					Please scan the QR Code of the bean you want to add to the inventory.
				</Text>
			)}
		</View>
	);

	const BottomContent: FC = () => (
		<View style={ScanBeanQrCodeScreenStyle.bottomContent}>
			<ApplicationLogoImage style={ScanBeanQrCodeScreenStyle.appTitleImage} />
		</View>
	);

	const InstructionItem: FC<PermissionStepInfo> = ({step, text}) => (
		<Text style={ScanBeanQrCodeScreenStyle.permissionStepText}>
			{step}. {text}
		</Text>
	);

	const renderInstructionItem: ListRenderItem<PermissionStepInfo> = ({item}) => (
		<InstructionItem step={item.step} text={item.text} />
	);

	const NotAuthorizedView: FC = () => {
		let steps: PermissionStepInfo[] = [];
		if (Platform.OS === 'android') {
			steps = CameraPermissionSteps.android;
		} else if (Platform.OS === 'ios') {
			steps = CameraPermissionSteps.ios;
		}

		function onAllowCameraUseButtonPressed() {
			openSettings().catch();
		}

		return (
			<View style={ScanBeanQrCodeScreenStyle.notAuthorizedView}>
				<Text style={ScanBeanQrCodeScreenStyle.notAuthorizedText} category="h6" status="danger">
					asmr is not allowed to use the camera
				</Text>
				<Text style={ScanBeanQrCodeScreenStyle.cameraRequirementText}>
					Camera is needed to scan the QR code of the incoming green bean.
				</Text>
				<Text style={ScanBeanQrCodeScreenStyle.permissionInstructionText} category="s1">
					Please follow this instruction:
				</Text>
				<FlatList
					contentContainerStyle={ScanBeanQrCodeScreenStyle.permissionStepList}
					data={steps}
					renderItem={renderInstructionItem}
					keyExtractor={item => item.step.toString()}
				/>

				<Button onPress={onAllowCameraUseButtonPressed}>Allow Camera Use</Button>
			</View>
		);
	};

	return (
		<CodeScanner
			ref={scannerRef}
			onRead={onQrCodeRead}
			topContent={<TopContent />}
			bottomContent={<BottomContent />}
			notAuthorizedView={<NotAuthorizedView />}
			cameraType="back"
			cameraStyle={ScanBeanQrCodeScreenStyle.camera}
			containerStyle={ScanBeanQrCodeScreenStyle.container}
			flashMode={CameraConstants.FlashMode.auto}
			checkAndroid6Permissions
			permissionDialogTitle="Permission Needed"
			permissionDialogMessage={
				'asmr need to use the camera to scan the QR code of the green bean.\n\n' +
				'Please tap Allow on the dialog that will appear next.'
			}
			buttonPositive="I Understand"
		/>
	);
};

export default ScanBeanQrCodeScreen;
