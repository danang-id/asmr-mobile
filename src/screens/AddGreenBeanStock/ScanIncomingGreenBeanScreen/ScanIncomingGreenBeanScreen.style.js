import {StyleSheet} from 'react-native';

const ScanIncomingGreenBeanScreenStyle = StyleSheet.create({
	camera: {
		overflow: 'hidden',
	},
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	topContent: {
		paddingHorizontal: 15,
	},
	topContentText: {
		textAlign: 'center',
	},

	bottomContent: {
		paddingHorizontal: 15,
	},
	appTitleImage: {
		height: 50,
		width: 145,
	},

	notAuthorizedView: {
		paddingHorizontal: 15,
	},
	notAuthorizedText: {
		textAlign: 'center',
		marginBottom: 5,
	},
	cameraRequirementText: {
		textAlign: 'center',
		fontSize: 18,
		marginBottom: 40,
	},
	permissionStepList: {
		marginBottom: 20,
	},
	permissionStepText: {
		fontSize: 18,
	},
	permissionInstructionText: {
		fontSize: 18,
	},
});

export default ScanIncomingGreenBeanScreenStyle;
