// noinspection DuplicatedCode
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, Platform, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import {check as checkPermission, request as requestPermission, openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import Gleap from 'react-native-gleapsdk';
import {API_BASE_URL, GLEAP_TOKEN} from '@env';
import ErrorCode from '../../../core/enums/ErrorCode';
import ApplicationLogoImage from '../../../components/ApplicationLogoImage';
import useInit from '../../../libs/hooks/InitHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import useServices from '../../../libs/hooks/ServiceHook';
import IncomingGreenBeanRoutes from '../AddGreenBeanStockRoutes';

import ScanBeanQrCodeScreenStyle from './ScanBeanQrCodeScreen.style';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';
const permissionSteps = {
	android: [
		{
			step: 1,
			text: 'Tap "Allow Camera Use" button bellow.',
		},
		{
			step: 2,
			text: 'Tap "Permissions".',
		},
		{
			step: 3,
			text: 'Tap "Camera" and set to Allow.',
		},
	],
	ios: [
		{
			step: 1,
			text: 'Tap "Allow Camera Use" button bellow.',
		},
		{
			step: 2,
			text: 'Toggle "Camera" permission to allow camera use.',
		},
	],
};

type ScanIncomingGreenBeanScreenProps = NativeStackScreenProps<{}, IncomingGreenBeanRoutes.ScanGreenBeanQrCode>;

const ScanBeanQrCodeScreen: FC<ScanIncomingGreenBeanScreenProps> = ({navigation}) => {
	useInit(onInit);
	const logger = useLogger(ScanBeanQrCodeScreen);
	const {handleError, handleErrors, bean: beanService} = useServices();

	const [bean, setBean] = useState();
	const [beanId, setBeanId] = useState();
	const [cameraUseAllowed, setCameraUseAllowed] = useState(false);
	const scannerRef = useRef();

	async function onInit() {
		let permission = '';
		if (Platform.OS === 'android') {
			permission = 'android.permission.CAMERA';
		} else if (Platform.OS === 'ios') {
			permission = 'ios.permission.CAMERA';
		}

		if (!permission) {
			return;
		}

		let status = await checkPermission();
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
		setBeanId();
		scannerRef.current?.reactivate();
	}

	function onQrCodeRead(event: BarCodeReadEvent) {
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
			setBean();
			return;
		}

		getBean().catch();
	}

	function onBeanChanged() {
		if (!bean) {
			return;
		}

		navigation.navigate(IncomingGreenBeanRoutes.ConfirmBeanWeightScreen, {bean});
	}

	async function getBean() {
		try {
			const result = await beanService.getById(beanId);
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
			handleError(error, logger);
		}
	}

	function showAlert(message, onTryAgain?: () => void) {
		Alert.alert(message, undefined, [
			{
				style: 'destructive',
				text: 'Cancel',
				onPress: () => {
					navigation.goBack();
				},
			},
			{
				text: 'Try Again',
				onPress: onTryAgain,
			},
		]);
	}

	useEffect(() => {
		navigation.addListener('focus', onNavigationFocus);
		return () => {
			navigation.removeListener('focus', onNavigationFocus);
		};
	});
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

	const InstructionItem: FC = ({step, text}) => (
		<Text style={ScanBeanQrCodeScreenStyle.permissionStepText}>
			{step}. {text}
		</Text>
	);

	function renderInstructionItem({item}) {
		return <InstructionItem step={item.step} text={item.text} />;
	}

	const NotAuthorizedView: FC = () => {
		let steps = [];
		if (Platform.OS === 'android') {
			steps = permissionSteps.android;
		} else if (Platform.OS === 'ios') {
			steps = permissionSteps.ios;
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
					keyExtractor={item => item.step}
				/>

				<Button onPress={onAllowCameraUseButtonPressed}>Allow Camera Use</Button>
			</View>
		);
	};

	return (
		<QRCodeScanner
			ref={scannerRef}
			onRead={onQrCodeRead}
			topContent={<TopContent />}
			bottomContent={<BottomContent />}
			notAuthorizedView={<NotAuthorizedView />}
			cameraType="back"
			cameraStyle={ScanBeanQrCodeScreenStyle.camera}
			containerStyle={ScanBeanQrCodeScreenStyle.container}
			flashMode={RNCamera.Constants.FlashMode.auto}
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
