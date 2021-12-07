import {Text, TextElement} from '@ui-kitten/components';
import React, {FC, memo} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

export interface StatisticItemProps extends ViewProps {
	name: string;
	value?: string;
}
const StatisticItem: FC<StatisticItemProps> = props => {
	const {name, children, value, style, ...rest} = props;

	return (
		<View style={[styles.container, style]} {...rest}>
			<Text style={[styles.nameText]}>{name}</Text>
			<Text style={[styles.valueText]}>
				{value ?? ''}
				{(children as TextElement) ?? ''}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	nameText: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'left',
	},
	valueText: {
		fontSize: 15,
		textAlign: 'right',
	},
});

export default memo(StatisticItem);
