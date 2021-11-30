import {StyleSheet} from 'react-native';

const ProgressScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {
		paddingHorizontal: 15,
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

	loadingView: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	contentView: {},
	currentlyRoastingText: {
		fontWeight: '400',
		fontSize: 20,
	},
	beanNameText: {
		marginTop: 5,
		color: '#432D27',
		fontWeight: '800',
		fontSize: 32,
	},

	greenBeanWeightCard: {
		marginTop: 15,
	},
	greenBeanWeightText: {
		fontWeight: '600',
	},

	beanDescriptionCard: {
		marginTop: 5,
	},

	confirmCard: {
		marginTop: 5,
	},
	beanWeightInput: {},
	finalizeButton: {
		marginTop: 10,
	},

	cancelCard: {
		marginTop: 5,
		marginBottom: 20,
	},
	cancelButton: {},
});

export default ProgressScreenStyle;
