import {StyleSheet} from 'react-native';

const HomeScreenStyle = StyleSheet.create({
	contentContainer: {},
	scrollView: {},
	scrollViewContentContainer: {
		flexDirection: 'column',
	},

	baseCard: {
		borderRadius: 0,
	},

	unsupportedRoleCard: {},
	unsupportedRoleText: {
		fontSize: 17,
		marginBottom: 10,
	},

	productionStatusCard: {
		marginBottom: 20,
	},
	productionStatusHeaderView: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	productionStatusIcon: {
		height: 42,
		width: 42,
	},
	productionStatusSideView: {
		marginHorizontal: 15,
		flexDirection: 'column',
	},
	productionStatusCurrentlyRoastingText: {
		fontSize: 16,
		fontWeight: '400',
	},
	productionStatusBeanNameText: {
		fontSize: 20,
		fontWeight: '800',
		color: '#2067F7',
	},
	productionStatusBeanWeightText: {
		marginTop: 5,
		fontSize: 16,
	},
	productionStatusTimeoutWarningText: {
		marginTop: 5,
		fontSize: 16,
	},
	productionStatusFooterView: {
		marginTop: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	productionStatusCreatedText: {
		fontStyle: 'italic',
	},
	productionViewProgressText: {
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},

	stockHistoryCard: {
		marginBottom: 10,
	},
	stockHistoryEmptyText: {},
	moreStockHistoryText: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},

	roastingHistoryCard: {
		marginBottom: 10,
	},
	roastingHistoryEmptyText: {},
	moreRoastingHistoryText: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},

	packagingHistoryCard: {},
	packagingHistoryEmptyText: {},
	morePackagingHistoryText: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},

	stockItemView: {
		marginVertical: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	stockItemIcon: {
		height: 24,
		width: 24,
	},
	stockItemSideView: {
		marginLeft: 10,
		flexDirection: 'column',
	},
	stockItemBeanNameText: {
		fontSize: 16,
		fontWeight: '600',
	},
	stockItemWeightText: {},
	stockItemCreatedText: {
		marginTop: 4,
		fontStyle: 'italic',
	},

	roastingItemView: {
		marginVertical: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	roastingItemIcon: {
		height: 24,
		width: 24,
	},
	roastingItemSideView: {
		marginLeft: 10,
		flexDirection: 'column',
	},
	roastingItemBeanNameText: {
		fontSize: 16,
		fontWeight: '600',
	},
	roastingItemWeightText: {},
	roastingItemCreatedText: {
		marginTop: 4,
		fontStyle: 'italic',
	},
});

export default HomeScreenStyle;
