import React, {FC} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text} from '@ui-kitten/components';

export function createCardHeader(title: string, subtitle?: string): FC {
	let style = StyleSheet.create({
		title: {},
		subtitle: {},
	});

	if (Platform.OS === 'android') {
		style = StyleSheet.create({
			title: {},
			subtitle: {
				fontSize: 14,
				fontWeight: '700',
			},
		});
	} else if (Platform.OS === 'ios') {
		style = StyleSheet.create({
			title: {},
			subtitle: {},
		});
	}

	return props => {
		return (
			<View {...props}>
				<Text style={style.title} category="h6" status="primary">
					{title}
				</Text>
				{!!subtitle && (
					<Text style={style.subtitle} category="s1">
						{subtitle}
					</Text>
				)}
			</View>
		);
	};
}
