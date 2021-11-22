import {StyleSheet} from 'react-native';
import applicationColors from '../../../styles/colors';

const ConfirmGreenBeanWeightScreenStyle = StyleSheet.create({
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
	roastGreenBeanButton: {},
});

export default ConfirmGreenBeanWeightScreenStyle;
