import ApplicationLogo from 'asmr-assets/ApplicationLogo.png';
import React, {FC} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import FastImage, {ImageStyle} from 'react-native-fast-image';

export interface ApplicationLogoImageProps {
	style?: ImageStyle;
}

const ApplicationLogoImage: FC<ApplicationLogoImageProps> = ({style, ...props}) => {
	const colorScheme = useColorScheme();
	const applicationLogoImageStyle = StyleSheet.compose(style, {});

	return (
		<FastImage
			style={applicationLogoImageStyle}
			source={colorScheme === 'dark' ? ApplicationLogo : ApplicationLogo}
			{...props}
		/>
	);
};

export default ApplicationLogoImage;
