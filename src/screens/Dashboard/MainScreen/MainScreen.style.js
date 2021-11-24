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
	appTitleImage: {
		height: 50,
		width: 145,
		marginBottom: 15,
	},
	greetingText: {
		fontSize: 20,
		fontWeight: '500',
		marginBottom: 20,
	},

	unsupportedRoleCard: {},
	unsupportedRoleText: {
		fontSize: 17,
		marginBottom: 15,
	},

	productionStatusCard: {
		marginBottom: 10,
	},
	productionStatusText: {
		fontSize: 18,
		fontWeight: '700',
	},
	productionFinishText: {
		marginTop: 10,
		fontSize: 16,
	},
	productionActionView: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	productionCancelButton: {
		marginRight: 5,
	},
	productionFinishButton: {},

	stockHistoryCard: {
		marginBottom: 15,
	},
	stockText: {
		marginVertical: 3,
	},
	moreStockText: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},

	roastingHistoryCard: {
		marginBottom: 15,
	},
	roastingText: {
		marginVertical: 3,
	},
	moreRoastingText: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'right',
	},
});

export default MainScreenStyle;
