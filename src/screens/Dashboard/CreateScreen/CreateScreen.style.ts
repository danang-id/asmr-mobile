import {Dimensions, StyleSheet} from 'react-native';

const CreateScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	contentView: {
		marginHorizontal: 15,
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

	createView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: Dimensions.get('window').height - 190,
	},
	createQuestionText: {
		fontSize: 26,
		fontWeight: '600',
		marginBottom: 20,
	},
	addGreenBeanStockButton: {
		marginBottom: 10,
	},
	roastGreenBeanButton: {},
});

export default CreateScreenStyle;
