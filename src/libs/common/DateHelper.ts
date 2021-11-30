export function getHumanizedDate(date: Date | unknown) {
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

export function getGreetingString(name: string) {
	let greeting = '';
	const date = new Date();
	const hour = date.getHours();
	if (hour < 12) {
		greeting += 'Good morning, ';
	} else if (hour >= 12 && hour <= 17) {
		greeting += 'Good afternoon, ';
	} else if (hour >= 17 && hour <= 24) {
		greeting += 'Good evening, ';
	}
	return greeting + name + '!';
}
