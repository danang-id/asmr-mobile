import React, {FC} from 'react';
import {ImageStyle, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const MaterialIconsPack = {
	name: 'material',
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
	toReactElement: (props: object) => MaterialIcons({name, ...props}),
});

type MaterialIconsProps = {
	name: string | symbol;
	style?: ImageStyle;
};
const MaterialIcons: FC<MaterialIconsProps> = ({name, style}) => {
	const {height, tintColor, ...iconStyle} = StyleSheet.flatten(style ?? {});
	return <Icon name={name as string} size={height as number} color={tintColor} style={iconStyle} />;
};
