import {StyleSheet} from 'react-native';

const ProgressScreenStyle = StyleSheet.create({
	contentView: {},
	loadingView: {
		flex: 1,
		padding: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingText: {
		marginTop: 10,
		marginHorizontal: 20,
		textAlign: 'center',
	},

	scrollView: {
		paddingHorizontal: 15,
	},
	scrollViewContentContainer: {
		flexDirection: 'column',
	},

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
	statisticItem: {
		marginVertical: 3,
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
