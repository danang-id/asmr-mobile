// noinspection DuplicatedCode

import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, Platform, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import {check as checkPermission, openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {API_BASE_URL} from '@env';
import ErrorCode from '../../../core/enums/ErrorCode';
import AppTitleImage from '../../../components/AppTitleImage';
import useInit from '../../../libs/hooks/InitHook';
import useLogger from '../../../libs/hooks/LoggerHook';
import useServices from '../../../libs/hooks/ServiceHook';
import RoastGreenBeanRoutes from '../RoastGreenBeanRoutes';

import ScanGreenBeanScreenStyle from './ScanGreenBeanScreen.style';

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

type ScanGreenBeanScreenProps = NativeStackScreenProps<{}, RoastGreenBeanRoutes.ScanGreenBean>;

const ScanGreenBeanScreen: FC<ScanGreenBeanScreenProps> = ({navigation}) => {
	useInit(onInit);
	const logger = useLogger(ScanGreenBeanScreen);
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

		getBean().then();
	}

	function onBeanChanged() {
		if (!bean) {
			return;
		}

		navigation.navigate(RoastGreenBeanRoutes.BeanInformation, {bean});
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
		<View style={ScanGreenBeanScreenStyle.topContent}>
			{cameraUseAllowed && (
				<Text category="h6" style={ScanGreenBeanScreenStyle.topContentText}>
					Please scan the QR Code of the green bean that you will roast.
				</Text>
			)}
		</View>
	);

	const BottomContent: FC = () => (
		<View style={ScanGreenBeanScreenStyle.bottomContent}>
			<AppTitleImage style={ScanGreenBeanScreenStyle.appTitleImage} />
		</View>
	);

	const InstructionItem: FC = ({step, text}) => (
		<Text style={ScanGreenBeanScreenStyle.permissionStepText}>
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
			openSettings().then();
		}

		return (
			<View style={ScanGreenBeanScreenStyle.notAuthorizedView}>
				<Text style={ScanGreenBeanScreenStyle.notAuthorizedText} category="h6" status="danger">
					asmr is not allowed to use the camera
				</Text>
				<Text style={ScanGreenBeanScreenStyle.cameraRequirementText}>
					Camera is needed to scan the QR code of the incoming green bean.
				</Text>
				<Text style={ScanGreenBeanScreenStyle.permissionInstructionText} category="s1">
					Please follow this instruction:
				</Text>
				<FlatList
					contentContainerStyle={ScanGreenBeanScreenStyle.permissionStepList}
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
			cameraStyle={ScanGreenBeanScreenStyle.camera}
			containerStyle={ScanGreenBeanScreenStyle.container}
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

export default ScanGreenBeanScreen;
