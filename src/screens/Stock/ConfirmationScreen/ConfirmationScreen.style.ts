import {StyleSheet} from 'react-native';

const ConfirmationScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},

	confirmCard: {
		marginHorizontal: 15,
		marginTop: 5,
		marginBottom: 15,
	},
	beanWeightInput: {
		marginBottom: 10,
	},
	addToInventoryButton: {},

	resultView: {
		minHeight: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
	},
	resultIcon: {
		height: 72,
	},
	resultIconSuccess: {
		color: '#1F871F',
	},
	resultIconFailed: {
		color: '#8C0E2D',
	},
	resultStatusText: {
		marginVertical: 10,
	},
	resultDescriptionText: {
		marginVertical: 10,
		textAlign: 'center',
		fontSize: 16,
	},
	resultActionView: {
		marginTop: 50,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	resultButton: {
		marginHorizontal: 5,
	},
});

export default ConfirmationScreenStyle;
