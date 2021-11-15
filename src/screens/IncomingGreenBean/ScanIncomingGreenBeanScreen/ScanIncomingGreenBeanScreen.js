import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, Platform, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@ui-kitten/components';
import {check as checkPermission, openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {API_BASE_URL} from '@env';
import ErrorCode from '../../../core/enums/ErrorCode';
import useInit from '../../../libs/hooks/InitHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import useServices from '../../../libs/hooks/ServiceHook';

import ScanIncomingGreenBeanScreenStyle from './ScanIncomingGreenBeanScreen.style';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';

const ScanIncomingGreenBeanScreen: FC = () => {
	useInit(onInit);
	const logger = useLogger(ScanIncomingGreenBeanScreen);
	const navigation = useNavigation();
	const {handleError, handleErrors, bean: beanService} = useServices();

	const [bean, setBean] = useState();
	const [beanId, setBeanId] = useState();
	const [cameraUseAllowed, setCameraUseAllowed] = useState(false);
	const scannerRef = useRef();

	async function onInit() {
		if (Platform.OS === 'android') {
			const permission = await checkPermission('android.permission.CAMERA');
			logger.info('android.permission.CAMERA', permission);
			setCameraUseAllowed(permission === 'granted');
			return;
		}

		if (Platform.OS === 'ios') {
			const permission = await checkPermission('ios.permission.CAMERA');
			logger.info('ios.permission.CAMERA', permission);
			setCameraUseAllowed(permission === 'granted');
		}
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
			return;
		}

		getBean().then();
	}

	function onBeanChanged() {
		// TODO: Something
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

	useEffect(onBeanIdChanged, [beanId]);
	useEffect(onBeanChanged, [bean]);

	const TopContent: FC = () => (
		<View style={ScanIncomingGreenBeanScreenStyle.topContent}>
			{cameraUseAllowed && (
				<Text category="h6" style={ScanIncomingGreenBeanScreenStyle.topContentText}>
					Please scan the QR Code of the incoming green bean.
				</Text>
			)}
		</View>
	);

	const BottomContent: FC = () => (
		<View style={ScanIncomingGreenBeanScreenStyle.bottomContent}>
			{!!bean && (
				<Text category="h6" style={ScanIncomingGreenBeanScreenStyle.bottomContentText}>
					Found bean: {bean.name}
				</Text>
			)}
		</View>
	);

	const NotAuthorizedView: FC = () => {
		function onAllowCameraUseButtonPressed() {
			openSettings().then();
		}

		return (
			<View style={ScanIncomingGreenBeanScreenStyle.notAuthorizedView}>
				<Text style={ScanIncomingGreenBeanScreenStyle.notAuthorizedText} category="h6" status="danger">
					asmr is not allowed to use the camera
				</Text>
				<Text style={ScanIncomingGreenBeanScreenStyle.cameraRequirementText}>
					Camera is needed to scan the QR code of the incoming green bean.
				</Text>
				<Text style={ScanIncomingGreenBeanScreenStyle.permissionInstructionText}>
					To allow camera use, you can open application permission under your device settings, and then allow
					Camera permission.
				</Text>

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
			flashMode={RNCamera.Constants.FlashMode.auto}
			checkAndroid6Permissions
			permissionDialogTitle="Requesting Permission"
			permissionDialogMessage="asmr need to use the camera to scan the QR code of the bean."
			buttonPositive="Allow"
		/>
	);
};

export default ScanIncomingGreenBeanScreen;
