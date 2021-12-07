import {Dimensions, StyleSheet} from 'react-native';

const CreateScreenStyle = StyleSheet.create({
	contentContainer: {
		paddingHorizontal: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: Dimensions.get('window').height - 150,
	},

	createQuestionText: {
		marginBottom: 40,
		fontSize: 28,
		fontWeight: '600',
		textAlign: 'center',
	},
	addGreenBeanStockButton: {
		width: 275,
		marginBottom: 15,
	},
	roastGreenBeanButton: {
		width: 275,
		marginBottom: 15,
	},
	packageRoastedBeanButton: {
		width: 275,
	},
});

export default CreateScreenStyle;
