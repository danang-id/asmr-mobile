import {StyleSheet} from 'react-native';
import applicationColors from '../../../styles/colors';

const ConfirmBeanWeightScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {},
	scrollViewContentContainer: {},

	beanImage: {
		aspectRatio: 3 / 2,
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: applicationColors.lightless,
	},

	keyboardAvoidingView: {
		padding: 15,
		marginBottom: 15,
	},

	beanCard: {
		marginBottom: 10,
	},
	greenBeanWeightInput: {
		marginBottom: 10,
	},

	resultView: {
		minHeight: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
	},
	resultIcon: {
		height: 20,
	},
});

export default ConfirmBeanWeightScreenStyle;
