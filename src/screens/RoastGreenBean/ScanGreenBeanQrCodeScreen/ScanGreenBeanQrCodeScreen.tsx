// noinspection DuplicatedCode

import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, ListRenderItem, Platform, View} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {check as checkPermission, openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import CodeScanner from 'asmr/components/CodeScanner';
import Bean from 'asmr/core/entities/Bean';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useServices from 'asmr/hooks/ServiceHook';
import {CameraPermissionSteps, PermissionStepInfo} from 'asmr/libs/common/PermissionHelper';
import ScanBeanQrCodeScreenStyle from 'asmr/screens/AddGreenBeanStock/ScanBeanQrCodeScreen/ScanBeanQrCodeScreen.style';
import {RoastGreenBeanParamList} from 'asmr/screens/RoastGreenBean/RoastGreenBeanNavigator';
import RoastGreenBeanRoutes from 'asmr/screens/RoastGreenBean/RoastGreenBeanRoutes';

import ScanGreenBeanQrCodeScreenStyle from './ScanGreenBeanQrCodeScreen.style';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';

type ScanGreenBeanScreenProps = NativeStackScreenProps<
	RoastGreenBeanParamList,
	RoastGreenBeanRoutes.ScanGreenBeanQrCode
>;
const ScanGreenBeanQrCodeScreen: FC<ScanGreenBeanScreenProps> = ({navigation}) => {
	useInitAsync(onInitAsync);
	const logger = useLogger(ScanGreenBeanQrCodeScreen);
	const {handleError, handleErrors, bean: beanService} = useServices();

	const [bean, setBean] = useState<Bean | undefined>();
	const [beanId, setBeanId] = useState<string | undefined>();
	const [cameraUseAllowed, setCameraUseAllowed] = useState<boolean>(false);

	const scannerRef = useRef<QRCodeScanner>(null);

	async function onInitAsync(): Promise<void> {
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
		setBeanId(undefined);
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
			setBean(undefined);
			return;
		}

		getBean().catch();
	}

	function onBeanChanged() {
		if (!bean) {
			return;
		}

		navigation.navigate(RoastGreenBeanRoutes.ConfirmGreenBeanWeight, {bean});
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

	useEffect(() => {
		navigation.addListener('focus', onNavigationFocus);
		return () => {
			navigation.removeListener('focus', onNavigationFocus);
		};
	});
	useEffect(onBeanIdChanged, [beanId]);
	useEffect(onBeanChanged, [bean]);

	const TopContent: FC = () => (
		<View style={ScanGreenBeanQrCodeScreenStyle.topContent}>
			{cameraUseAllowed && (
				<Text category="h6" style={ScanGreenBeanQrCodeScreenStyle.topContentText}>
					Please scan the QR Code of the green bean that you want to roast.
				</Text>
			)}
		</View>
	);

	const BottomContent: FC = () => (
		<View style={ScanGreenBeanQrCodeScreenStyle.bottomContent}>
			<ApplicationLogoImage style={ScanGreenBeanQrCodeScreenStyle.appTitleImage} />
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
			<View style={ScanGreenBeanQrCodeScreenStyle.notAuthorizedView}>
				<Text style={ScanGreenBeanQrCodeScreenStyle.notAuthorizedText} category="h6" status="danger">
					asmr is not allowed to use the camera
				</Text>
				<Text style={ScanGreenBeanQrCodeScreenStyle.cameraRequirementText}>
					Camera is needed to scan the QR code of the incoming green bean.
				</Text>
				<Text style={ScanGreenBeanQrCodeScreenStyle.permissionInstructionText} category="s1">
					Please follow this instruction:
				</Text>
				<FlatList
					contentContainerStyle={ScanGreenBeanQrCodeScreenStyle.permissionStepList}
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
			cameraStyle={ScanGreenBeanQrCodeScreenStyle.camera}
			containerStyle={ScanGreenBeanQrCodeScreenStyle.container}
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

export default ScanGreenBeanQrCodeScreen;
