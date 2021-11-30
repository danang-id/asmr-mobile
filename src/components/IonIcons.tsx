import React, {FC} from 'react';
import {ImageStyle, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const IonIconsPack = {
	name: 'ion',
	icons: createIconsMap(),
};

function createIconsMap() {
	return new Proxy(
		{},
		{
			get(target, name) {
				return IconProvider(name);
			},
		},
	);
}

const IconProvider = (name: string | symbol) => ({
	toReactElement: (props: object) => IonIcons({name, ...props}),
});

type IonIconsProps = {
	name: string | symbol;
	style?: ImageStyle;
};
const IonIcons: FC<IonIconsProps> = ({name, style}) => {
	const {height, tintColor, ...iconStyle} = StyleSheet.flatten(style ?? {});
	return <Icon name={name as string} size={height as number} color={tintColor} style={iconStyle} />;
};
