import {API_BASE_URL} from '@env';
import React, {FC, memo} from 'react';
import {StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import FastImage, {ImageStyle, ResizeMode} from 'react-native-fast-image';
import useAuthentication from 'asmr/hooks/authentication.hook';

export interface ProfilePictureProps extends TouchableOpacityProps {
	size: number;
	resizeMode?: ResizeMode;
	rounded?: boolean;
}

const ProfilePicture: FC<ProfilePictureProps> = ({size, resizeMode, rounded, ...props}) => {
	const {user} = useAuthentication();

	const style = StyleSheet.flatten({
		borderRadius: rounded ? 100 : 0,
		height: size,
		width: size,
	});

	return (
		<TouchableOpacity {...props}>
			<FastImage
				style={style as ImageStyle}
				resizeMode={resizeMode ?? FastImage.resizeMode.contain}
				source={{
					uri: API_BASE_URL + user?.image,
					priority: FastImage.priority.high,
				}}
			/>
		</TouchableOpacity>
	);
};

export default memo(ProfilePicture);
