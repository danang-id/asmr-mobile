export function formatValue(value: number, unit: string): string {
	const isGreaterThanThousand = value >= 1000;
	if (isGreaterThanThousand) {
		value = value / 1000;
		unit = `kilo${unit}`;
	}
	const isSingular = value === 1 || value === 0 || value === -1;
	return `${value} ${unit}${!isSingular ? 's' : ''}`;
}
