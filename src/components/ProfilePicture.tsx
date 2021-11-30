import {API_BASE_URL} from '@env';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import useAuthentication from 'asmr/hooks/AuthenticationHook';

export interface ProfilePictureProps {
	size: number;
}

const ProfilePicture: FC<ProfilePictureProps> = ({size}) => {
	const {user} = useAuthentication();

	const style = StyleSheet.flatten({
		borderRadius: 100,
		height: size,
		width: size,
	});

	return (
		<FastImage
			style={style}
			resizeMode={FastImage.resizeMode.contain}
			source={{
				uri: API_BASE_URL + user?.image,
				priority: FastImage.priority.high,
			}}
		/>
	);
};

export default ProfilePicture;
