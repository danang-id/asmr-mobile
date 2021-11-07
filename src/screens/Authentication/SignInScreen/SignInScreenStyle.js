import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		minHeight: '100%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	signInForm: {
		padding: 10,
	},
	actions: {
		padding: 10,
	},

	applicationLogo: {
		height: 50,
		width: 195,
	},

	signInTextInput: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},

	signInButton: {
		borderWidth: 1,
		padding: 10,
	},
});
