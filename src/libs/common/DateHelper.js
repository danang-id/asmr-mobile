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
