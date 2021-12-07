import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CodeScannerView from 'asmr/components/CodeScannerView';
import useInventory from 'asmr/hooks/inventory.hook';
import useRefresh from 'asmr/hooks/refresh.hook';
import {RoastParamList} from 'asmr/screens/Roast/RoastNavigator';
import RoastRoutes from 'asmr/screens/Roast/RoastRoutes';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';

type ScanGreenBeanScreenProps = NativeStackScreenProps<RoastParamList, RoastRoutes.ScanQrCode>;
const ScanQrCodeScreen: FC<ScanGreenBeanScreenProps> = ({navigation}) => {
	const {getBeanById, refresh: refreshInventory} = useInventory();
	useRefresh([refreshInventory]);

	const [beanId, setBeanId] = useState<string | undefined>();
	const scannerRef = useRef<QRCodeScanner>(null);

	function onNavigationFocus() {
		setBeanId(undefined);
	}

	function onCodeScannerRead(event: BarCodeReadEvent) {
		const qrCodeData = event.data ?? '';
		if (!qrCodeData.startsWith(beanPublicationUrl)) {
			showAlert('Invalid QR Code', undefined, () => {
				scannerRef.current?.reactivate();
			});
			return;
		}

		setBeanId(qrCodeData.substring(beanPublicationUrl.length));
	}

	function onBeanIdChanged() {
		if (!beanId) {
			return;
		}

		const bean = getBeanById(beanId);
		if (bean?.inventory.currentGreenBeanWeight === 0) {
			showAlert(
				'Bean Unavailable',
				`We do not have any ${bean.name} (green bean) available in the inventory.\n\n` +
					'Please add green bean to inventory first.',
				() => {
					scannerRef.current?.reactivate();
				},
			);
			return;
		}

		navigation.navigate(RoastRoutes.Confirmation, {beanId});
	}

	function showAlert(title: string, message?: string, onTryAgain?: () => void) {
		Alert.alert(title, message, [
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

	return (
		<CodeScannerView
			ref={scannerRef}
			onNavigationFocus={onNavigationFocus}
			onRead={onCodeScannerRead}
			usageText="Please scan the QR Code of the green bean that you want to roast."
			permissionRequiredText="We need the permission to use the camera to scan green bean's QR code"
		/>
	);
};

export default ScanQrCodeScreen;
