import {StyleSheet} from 'react-native';

const MainScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {
		paddingHorizontal: 15,
	},
	scrollViewContentContainer: {
		flexDirection: 'column',
	},

	headerView: {
		paddingTop: 30,
		paddingBottom: 10,
	},
	headerBarView: {
		marginBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	appTitleImage: {
		height: 50,
		width: 145,
	},
	greetingText: {
		fontSize: 20,
		fontWeight: '500',
		marginBottom: 5,
	},

	unsupportedRoleCard: {},
	unsupportedRoleText: {
		fontSize: 17,
		marginBottom: 15,
	},

	productionStatusCard: {
		marginBottom: 15,
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

	packagingHistoryCard: {
		marginBottom: 20,
	},
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

export default MainScreenStyle;
