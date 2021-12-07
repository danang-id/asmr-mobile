import React, {FC, memo, useState} from 'react';
import {
	ActivityIndicator,
	GestureResponderEvent,
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	ViewProps,
	ViewStyle,
} from 'react-native';
import FastImage, {ImageStyle, OnLoadEvent, OnProgressEvent, ResizeMode} from 'react-native-fast-image';

interface ImageProps extends ViewProps {
	baseStyle?: StyleProp<ViewStyle | ImageStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	uri: string;
	resizeMode?: ResizeMode;
	fallback?: boolean;
	onPress?: (event: GestureResponderEvent) => void;
	onLoadStart?: () => void;
	onProgress?: (event: OnProgressEvent) => void;
	onLoad?: (event: OnLoadEvent) => void;
	onError?: () => void;
	onLoadEnd?: () => void;
	loaderSize?: number | 'small' | 'large';
	style?: StyleProp<ImageStyle>;
}

const Image: FC<ImageProps> = props => {
	const {baseStyle, containerStyle, uri, onPress, onLoad, style, loaderSize, ...restProps} = props;

	const [loaded, setLoaded] = useState(false);

	function onImageLoad(event: OnLoadEvent) {
		setLoaded(true);
		onLoad && onLoad(event);
	}

	return (
		<TouchableOpacity
			style={[baseStyle ? baseStyle : styles.base, containerStyle]}
			onPress={onPress}
			disabled={!onPress}>
			<FastImage
				style={[baseStyle ? (baseStyle as StyleProp<ImageStyle>) : styles.base, style]}
				onLoad={onImageLoad}
				source={{uri: uri}}
				{...restProps}
			/>
			{!loaded && <ActivityIndicator color={LOADER_COLOR} style={styles.loader} size={loaderSize} />}
		</TouchableOpacity>
	);
};

const BG_COLOR = 'rgba(240, 242, 245, 1)';
const LOADER_COLOR = 'rgba(55, 107, 251, 1)';

const styles = StyleSheet.create({
	base: {
		height: '100%',
		width: '100%',
	},
	loader: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: BG_COLOR,
	},
});

export default memo(Image);
