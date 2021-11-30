import React, {forwardRef, ForwardRefRenderFunction} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {BarCodeReadEvent, RNCamera, RNCameraProps} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

type FlashMode = Readonly<{on: never; off: never; torch: never; auto: never}>;
export interface CodeScannerProps {
	onRead(e: BarCodeReadEvent): void;
	vibrate?: boolean;
	reactivate?: boolean;
	reactivateTimeout?: number;
	fadeIn?: boolean;
	showMarker?: boolean;
	cameraType?: 'front' | 'back';
	customMarker?: JSX.Element;
	containerStyle?: StyleProp<ViewStyle>;
	cameraStyle?: StyleProp<ViewStyle>;
	markerStyle?: StyleProp<ViewStyle>;
	topViewStyle?: StyleProp<ViewStyle>;
	bottomViewStyle?: StyleProp<ViewStyle>;
	topContent?: JSX.Element | string;
	bottomContent?: JSX.Element | string;
	notAuthorizedView?: JSX.Element;
	permissionDialogTitle?: string;
	permissionDialogMessage?: string;
	buttonPositive?: string;
	checkAndroid6Permissions?: boolean;
	cameraProps?: RNCameraProps;
	cameraTimeout?: number;
	cameraTimeoutView?: JSX.Element;
	flashMode?: FlashMode;
}

const CodeScanner: ForwardRefRenderFunction<QRCodeScanner, CodeScannerProps> = (props, ref) => (
	<QRCodeScanner ref={ref} {...props} />
);

export const CameraConstants = RNCamera.Constants;

export type CodeScannedEvent = BarCodeReadEvent;

export default forwardRef(CodeScanner);
