import {StyleSheet} from 'react-native';

const BeanInformationScreenStyle = StyleSheet.create({
	container: {
		minHeight: '100%',
	},
	analyticsView: {
		width: '100%',
		marginTop: 10,
		marginBottom: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	analyticsText: {
		marginTop: 10,
		marginHorizontal: 20,
		textAlign: 'center',
	},

	baseCard: {
		borderRadius: 0,
		marginTop: 10,
	},
	greenBeanCard: {},
	roastedBeanCard: {},
	statisticItem: {
		marginVertical: 3,
	},
});

export default BeanInformationScreenStyle;
