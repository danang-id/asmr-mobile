export type PermissionStepInfo = {step: number; text: string};
export type PermissionStepsInfo = {android: PermissionStepInfo[]; ios: PermissionStepInfo[]};
export const CameraPermissionSteps: PermissionStepsInfo = {
	android: [
		{
			step: 1,
			text: 'Tap "Allow Camera Use" button bellow.',
		},
		{
			step: 2,
			text: 'Tap "Permissions".',
		},
		{
			step: 3,
			text: 'Tap "Camera" and set to Allow.',
		},
	],
	ios: [
		{
			step: 1,
			text: 'Tap "Allow Camera Use" button bellow.',
		},
		{
			step: 2,
			text: 'Toggle "Camera" permission to allow camera use.',
		},
	],
};
