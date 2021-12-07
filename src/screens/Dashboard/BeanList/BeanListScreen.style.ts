import {Dimensions, StyleSheet} from 'react-native';
import applicationColors from 'asmr/styles/colors';

const BeanListScreenStyle = StyleSheet.create({
	flatList: {
		height: Dimensions.get('window').height - 150,
	},
	flatListContentContainer: {},

	flatListFooter: {borderTopColor: applicationColors.lightless, borderTopWidth: 1},
	flatListFooterView: {
		padding: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	flatListFooterText: {
		textAlign: 'center',
	},

	flatListEmptyView: {
		minHeight: '100%',
		padding: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	flatListEmptyTitleText: {
		fontWeight: '700',
		fontSize: 24,
		textAlign: 'center',
	},
	flatListEmptyHelperText: {
		marginTop: 15,
		fontWeight: '400',
		fontSize: 16,
		textAlign: 'center',
	},
	flatListEmptyHelperButton: {
		marginTop: 30,
	},

	flatListDivider: {
		backgroundColor: applicationColors.lightless,
	},

	beanItemView: {
		padding: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	beanItemImage: {
		height: 60,
		width: 90,
	},
	beanItemSideView: {
		paddingHorizontal: 10,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	beanItemNameText: {
		fontWeight: '600',
		fontSize: 18,
	},
	beanItemDescriptionText: {
		fontWeight: '400',
		fontSize: 14,
	},
});

export default BeanListScreenStyle;
