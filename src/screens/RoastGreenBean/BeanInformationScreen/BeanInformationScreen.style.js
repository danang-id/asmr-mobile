import {StyleSheet} from 'react-native';

const BeanInformationScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	scrollView: {
		padding: 15,
	},
	scrollViewContentContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},

	beanImage: {
		aspectRatio: 3 / 2,
		width: '100%',
		marginBottom: 20,
	},
	beanNameText: {
		textAlign: 'center',
		width: '100%',
		marginBottom: 15,
	},
	beanDescriptionText: {
		width: '100%',
		marginBottom: 30,
	},
});

export default BeanInformationScreenStyle;
