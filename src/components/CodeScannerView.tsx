import {GLEAP_TOKEN} from '@env';
import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@ui-kitten/components';
import React, {FC, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef, useState} from 'react';
import {FlatList, ListRenderItem, Platform, StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Gleap from 'react-native-gleapsdk';
import {
	check as checkPermission,
	openSettings,
	Permission,
	PERMISSIONS,
	request as requestPermission,
} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import CodeScanner, {CodeScannerProps} from 'asmr/components/CodeScanner';
import useInitAsync, {useInit} from 'asmr/hooks/init.hook';
import {CameraPermissionSteps, PermissionStepInfo} from 'asmr/libs/common/Permission.helper';

interface CodeScannerViewProps extends CodeScannerProps {
	onNavigationFocus?: () => void;
	usageText?: string;
	permissionRequiredText?: string;
}
const CodeScannerView: ForwardRefRenderFunction<QRCodeScanner, CodeScannerViewProps> = (props, ref) => {
	const {onNavigationFocus: onParentNavigationFocus, usageText, permissionRequiredText, ...rest} = props;

	useInit(onInit);
	useInitAsync(onInitAsync);

	const navigation = useNavigation();
	const [cameraUseAllowed, setCameraUseAllowed] = useState<boolean>(false);

	const scannerRef = useRef<QRCodeScanner>(null);
	useImperativeHandle(ref, () => scannerRef.current as QRCodeScanner, [scannerRef]);

	function onInit() {
		navigation.addListener('focus', onNavigationFocus);
		return () => {
			navigation.removeListener('focus', onNavigationFocus);
		};
	}

	async function onInitAsync() {
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
		if (GLEAP_TOKEN) {
			Gleap.logEvent('Camera permission request', {status});
		}
	}

	function onNavigationFocus() {
		if (typeof onParentNavigationFocus === 'function') {
			onParentNavigationFocus();
		}
		scannerRef.current?.reactivate();
	}

	const TopContent: FC = () => (
		<View style={style.topContent}>
			{cameraUseAllowed && (
				<Text category="h6" style={style.topContentText}>
					{usageText ?? 'Scan your QR code.'}
				</Text>
			)}
		</View>
	);

	const BottomContent: FC = () => (
		<View style={style.bottomContent}>
			<ApplicationLogoImage style={style.applicationLogoImage} />
		</View>
	);

	const InstructionItem: FC<PermissionStepInfo> = ({step, text}) => (
		<Text style={style.permissionStepText}>
			{step}. {text}
		</Text>
	);

	const renderInstructionItem: ListRenderItem<PermissionStepInfo> = ({item}) => (
		<InstructionItem step={item.step} text={item.text} />
	);

	const NotAuthorizedView: FC = () => {
		let steps: Array<PermissionStepInfo> = [];
		if (Platform.OS === 'android') {
			steps = CameraPermissionSteps.android;
		} else if (Platform.OS === 'ios') {
			steps = CameraPermissionSteps.ios;
		}

		function onAllowCameraUseButtonPressed() {
			openSettings().catch();
		}

		return (
			<View style={style.notAuthorizedView}>
				<Text style={style.notAuthorizedText} category="h6" status="danger">
					asmr is not allowed to use the camera
				</Text>
				<Text style={style.cameraRequirementText}>{permissionRequiredText}</Text>
				<Text style={style.permissionInstructionText} category="s1">
					Please follow this instruction:
				</Text>
				<FlatList
					contentContainerStyle={style.permissionStepList}
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
			topContent={<TopContent />}
			bottomContent={<BottomContent />}
			notAuthorizedView={<NotAuthorizedView />}
			cameraType="back"
			cameraStyle={style.camera}
			containerStyle={style.container}
			flashMode={RNCamera.Constants.FlashMode.auto}
			checkAndroid6Permissions
			permissionDialogTitle="Permission Needed"
			permissionDialogMessage={`${
				permissionRequiredText ? permissionRequiredText + '\n\n' : ''
			}Please tap Allow on the dialog that will appear next.`}
			buttonPositive="I Understand"
			{...rest}
		/>
	);
};

const style = StyleSheet.create({
	camera: {
		overflow: 'hidden',
	},
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	topContent: {
		paddingHorizontal: 15,
	},
	topContentText: {
		textAlign: 'center',
	},

	bottomContent: {
		paddingHorizontal: 15,
	},
	applicationLogoImage: {
		height: 50,
		width: 145,
	},

	notAuthorizedView: {
		paddingHorizontal: 15,
	},
	notAuthorizedText: {
		textAlign: 'center',
		marginBottom: 5,
	},
	cameraRequirementText: {
		textAlign: 'center',
		fontSize: 18,
		marginBottom: 40,
	},
	permissionStepList: {
		marginBottom: 20,
	},
	permissionStepText: {
		fontSize: 18,
	},
	permissionInstructionText: {
		fontSize: 18,
	},
});

export default forwardRef(CodeScannerView);
