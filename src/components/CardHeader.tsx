import {Text} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {FC} from 'react';
import {Platform, StyleSheet, View, ViewProps} from 'react-native';

export interface CardHeaderProps extends ViewProps {
	title: string;
	subtitle?: string;
}

const CardHeader: FC<CardHeaderProps> = ({title, subtitle, ...props}) => {
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

export function createCardHeader(title: string, subtitle?: string): RenderProp<ViewProps> {
	return <CardHeader title={title} subtitle={subtitle} />;
}

export default CardHeader;
