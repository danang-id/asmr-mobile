import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	list: {
		marginHorizontal: 10,
	},
	listHeaderView: {
		flexDirection: 'column',
		alignItems: 'center',
	},

	avatar: {
		height: 125,
		width: 125,
		marginVertical: 20,
	},
	nameText: {
		marginVertical: 5,
		textAlign: 'center',
		fontSize: 32,
		fontWeight: '700',
	},
	joinedOnText: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '400',
	},
	mainButtonGroupView: {
		width: '100%',
		marginTop: 20,
		marginBottom: 10,
		padding: 0,
		borderRadius: 20,
	},
	advancedButtonGroupView: {
		width: '100%',
		marginTop: 10,
		marginBottom: 20,
	},
	button: {
		borderRadius: 1,
	},
});
