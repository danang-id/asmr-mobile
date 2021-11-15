import {StyleSheet} from 'react-native';

const MainScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {
		marginHorizontal: 15,
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
		fontSize: 16,
		fontWeight: '700',
	},
	productionFinishText: {
		marginTop: 10,
		fontSize: 16,
	},
	productionFinishButton: {
		marginTop: 20,
	},

	productionHistoryCard: {
		marginBottom: 15,
	},
});

export default MainScreenStyle;
