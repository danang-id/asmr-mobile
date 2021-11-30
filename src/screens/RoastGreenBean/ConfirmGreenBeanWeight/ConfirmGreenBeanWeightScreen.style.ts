import {StyleSheet} from 'react-native';
import applicationColors from 'asmr/styles/colors';

const ConfirmGreenBeanWeightScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {},
	scrollViewContentContainer: {},

	keyboardAvoidingView: {},

	beanImage: {
		aspectRatio: 3 / 2,
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: applicationColors.lightless,
	},

	beanCard: {
		marginHorizontal: 15,
		marginTop: 15,
	},
	confirmCard: {
		marginHorizontal: 15,
		marginTop: 5,
		marginBottom: 20,
	},
	beanWeightInput: {
		marginBottom: 10,
	},
	roastGreenBeanButton: {},

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
		color: '#2067F7',
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

export default ConfirmGreenBeanWeightScreenStyle;
