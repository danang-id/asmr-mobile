import React, {FC} from 'react';
import {SafeAreaView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaViewProps} from 'react-native-safe-area-context';
import DashboardHeader, {DashboardHeaderProps} from 'asmr/components/DashboardHeader';

export interface DashboardLayoutProps extends SafeAreaViewProps {
	contentContainerStyle?: StyleProp<ViewStyle>;
	header?: DashboardHeaderProps;
	scrollable?: boolean;
}
const DashboardLayout: FC<DashboardLayoutProps> = props => {
	const {children, contentContainerStyle, header, scrollable, style, ...rest} = props;

	const {paddingBottom, ...baseContentContainerStyle} = styles.contentContainer;
	const contentContainerStyles: StyleProp<ViewStyle>[] = [baseContentContainerStyle, contentContainerStyle];

	if (scrollable === true) {
		let contentContainerPaddingBottom = paddingBottom;
		if (header?.showBorder === true) {
			contentContainerPaddingBottom += 1;
		}
		if (header?.showGreeting === true) {
			contentContainerPaddingBottom += 59;
		}
		contentContainerStyles.push({paddingBottom: contentContainerPaddingBottom});
	}

	return (
		<SafeAreaView style={[styles.container, style]} {...rest}>
			<DashboardHeader {...header} />
			<View style={contentContainerStyles}>{children}</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {},
	contentContainer: {
		paddingBottom: 160,
	},
});

export default DashboardLayout;
