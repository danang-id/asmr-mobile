import React, {FC} from 'react';
import {ImageStyle, StyleProp, StyleSheet, useColorScheme} from 'react-native';
import FastImage from 'react-native-fast-image';
import ApplicationLogo from '../assets/ApplicationLogo.png';

interface ApplicationLogoImageProps {
	style?: StyleProp<ImageStyle> | undefined;
}

const style = StyleSheet.create({
	image: {},
});

const ApplicationLogoImage: FC<ApplicationLogoImageProps> = props => {
	const colorScheme = useColorScheme();

	return (
		<FastImage style={style.image} source={colorScheme === 'dark' ? ApplicationLogo : ApplicationLogo} {...props} />
	);
};

export default ApplicationLogoImage;
