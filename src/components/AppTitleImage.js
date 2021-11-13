import React, {FC} from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet, useColorScheme} from 'react-native';
import AppTitle from '../assets/app-title.png';

interface AppTitleImageProps {
	style?: StyleProp<ImageStyle> | undefined;
}

const style = StyleSheet.create({
	image: {},
});

const AppTitleImage: FC<AppTitleImageProps> = props => {
	const colorScheme = useColorScheme();

	return <Image style={style.image} source={colorScheme === 'dark' ? AppTitle : AppTitle} {...props} />;
};

export default AppTitleImage;
