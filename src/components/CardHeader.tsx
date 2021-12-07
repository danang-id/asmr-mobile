import {Icon, Text, Tooltip} from '@ui-kitten/components';
import React, {FC, memo, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';

export interface CardHeaderProps extends ViewProps {
	title: string;
	information?: string;
}

const CardHeader: FC<CardHeaderProps> = props => {
	const {title, information, style, ...rest} = props;

	const [tooltipShown, setTooltipShown] = useState<boolean>(false);

	function onInformationIconPressed() {
		setTooltipShown(true);
	}

	function onTooltipBackdropPressed() {
		setTooltipShown(false);
	}

	function renderInformationIcon() {
		return (
			<TouchableOpacity onPress={onInformationIconPressed}>
				<Icon style={styles.informationIcon} name="information-circle-outline" pack="ion" />
			</TouchableOpacity>
		);
	}

	return (
		<View style={[style, styles.container]} {...rest}>
			<Text style={styles.title} category="h6" status="primary">
				{title}
			</Text>
			{!!information && (
				<Tooltip
					style={styles.tooltip}
					anchor={renderInformationIcon}
					placement="left end"
					visible={tooltipShown}
					onBackdropPress={onTooltipBackdropPressed}>
					<Text style={styles.tooltipText}>{information}</Text>
				</Tooltip>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'space-between',
	},
	title: {},
	informationIcon: {
		height: 18,
		width: 20,
	},

	tooltip: {
		width: Dimensions.get('window').width - 100,
	},
	tooltipText: {},
});

export default memo(CardHeader);
