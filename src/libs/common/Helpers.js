import Role from '../../core/enums/Role';

export function getHumanizedDate(date: Date) {
	if (!date || !(date instanceof Date)) {
		return '';
	}

	const monthStrings = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	return monthStrings[date.getMonth()] + ' ' + date.getFullYear();
}

export function getRoleString(role: number): string {
	switch (role) {
		case Role.Administrator:
			return 'Administrator';
		case Role.Server:
			return 'Server';
		case Role.Roaster:
			return 'Roaster';
		default:
			return 'Unknown';
	}
}
