import {StyleSheet} from 'react-native';
import applicationColors from 'asmr/styles/colors';

const ProfileScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	spinnerOverlayText: {
		color: applicationColors.light,
	},
	scrollView: {
		paddingHorizontal: 15,
	},
	scrollViewContentContainer: {
		flexDirection: 'column',
	},

	headerView: {
		alignItems: 'center',
	},
	profilePicture: {
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

	myProfileCard: {
		borderRadius: 10,
		width: '100%',
	},
	changeProfileText: {
		marginTop: 10,
	},

	roastingAnalyticsCard: {
		marginTop: 5,
		borderRadius: 10,
		width: '100%',
	},
	statisticItem: {
		marginVertical: 3,
	},
	moreAnalyticText: {
		marginTop: 10,
	},

	actionView: {
		width: '100%',
		marginTop: 20,
		marginBottom: 30,
	},
	shareFeedbackButton: {
		borderRadius: 10,
		marginBottom: 10,
	},
	signOutButton: {
		borderRadius: 10,
	},
});

export default ProfileScreenStyle;
