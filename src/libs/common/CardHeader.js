import React, {FC} from 'react';
import {View} from 'react-native';
import {Text} from '@ui-kitten/components';

export const createCardHeader: (title: string, subtitle?: string) => FC =
	(title, subtitle = undefined) =>
	props =>
		(
			<View {...props}>
				<Text category="h6" status="primary">
					{title}
				</Text>
				{!!subtitle && <Text category="s1">{subtitle}</Text>}
			</View>
		);
