import {API_BASE_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {CodeScannedEvent} from 'asmr/components/CodeScanner';
import CodeScannerView from 'asmr/components/CodeScannerView';
import Bean from 'asmr/core/entities/Bean';
import useInventory from 'asmr/hooks/inventory.hook';
import useRefresh from 'asmr/hooks/refresh.hook';
import PackagingRoutes from 'asmr/screens/Packaging/PackagingRoutes';
import {StockParamList} from 'asmr/screens/Stock/StockNavigator';

const beanPublicationUrl = API_BASE_URL + '/pub/bean/';

type ScanIncomingGreenBeanScreenProps = NativeStackScreenProps<StockParamList, PackagingRoutes.ScanQrCode>;
const ScanQrCodeScreen: FC<ScanIncomingGreenBeanScreenProps> = ({navigation}) => {
	const {getBeanById, refresh: refreshInventory} = useInventory();
	useRefresh([refreshInventory]);

	const [bean, setBean] = useState<Bean | undefined>();
	const [beanId, setBeanId] = useState<string | undefined>();
	const scannerRef = useRef<QRCodeScanner>(null);

	function onNavigationFocus() {
		setBeanId(undefined);
		scannerRef.current?.reactivate();
	}

	function onCodeScannerRead(event: CodeScannedEvent) {
		const qrCodeData = event.data ?? '';
		if (!qrCodeData.startsWith(beanPublicationUrl)) {
			showAlert('Invalid QR Code', undefined, () => {
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

		setBean(getBeanById(beanId));
	}

	function onBeanChanged() {
		if (!bean) {
			return;
		}

		// TODO: Continue navigation
		showAlert('Feature currently in progress.');
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
	useEffect(onBeanChanged, [bean]);

	return (
		<CodeScannerView
			ref={scannerRef}
			onNavigationFocus={onNavigationFocus}
			onRead={onCodeScannerRead}
			usageText="Please scan the QR Code of the roasted bean that you want to package."
			permissionRequiredText="We need the permission to use the camera to scan roasted bean's QR code"
		/>
	);
};

export default ScanQrCodeScreen;
