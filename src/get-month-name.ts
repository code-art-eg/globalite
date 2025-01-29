export function getMonthName(
	locale: string,
	month: number,
	format: 'short' | 'narrow' | 'long' = 'long',
	calendar: 'gregory' | 'islamic' = 'gregory'
): string {
	const key = `${locale}/${format}/${calendar}`;
	let monthNames = monthNamesCache.get(key);
	if (!monthNames) {
		const formatter = new Intl.DateTimeFormat(locale, {
			month: format,
			calendar: calendar,
		});
		monthNames = Array.from({ length: 12 }, (_, i) => {
			// in the year 2007 on the 21st day of each month
			// the month number is the same as in islamic calendar
			// corresponding to the year 1428
			const date = new Date(2007, i, 21);
			return formatter.format(date);
		});

		monthNamesCache.set(key, monthNames);
	}

	return monthNames[month];
}

const monthNamesCache = new Map<string, string[]>();
