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
		alignItems: 'center',
	},
	avatar: {
		borderRadius: 100,
		height: 125,
		width: 125,
		marginVertical: 20,
	},
	nameText: {
		marginBottom: 5,
		textAlign: 'center',
		fontSize: 32,
		fontWeight: '700',
	},
	joinedOnText: {
		marginBottom: 20,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '400',
	},

	usernameCard: {
		borderRadius: 10,
		width: '100%',
		marginBottom: 5,
	},
	emailAddressCard: {
		borderRadius: 10,
		width: '100%',
		marginBottom: 5,
	},
	workRolesCard: {
		borderRadius: 10,
		width: '100%',
		marginBottom: 20,
	},

	actionView: {
		width: '100%',
		marginBottom: 20,
	},
	signOutButton: {
		borderRadius: 10,
	},
});