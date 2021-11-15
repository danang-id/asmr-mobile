import {StyleSheet} from 'react-native';
import applicationColors from '../../../styles/colors';

const SignInScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	spinnerOverlayText: {
		color: applicationColors.light,
	},
	keyboardAvoidingView: {
		flexDirection: 'column',
		alignItems: 'center',
		marginHorizontal: 10,
	},

	headerLayout: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '40%',
	},
	signInCard: {
		width: '100%',
		marginVertical: 20,
	},
	actionLayout: {
		paddingVertical: 10,
	},

	appTitleImage: {
		height: 75,
		width: 217.5,
	},
	input: {
		marginVertical: 10,
	},
});

export default SignInScreenStyle;
