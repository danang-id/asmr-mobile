import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
	productionHistoryCard: {
		marginBottom: 15,
	},
});
