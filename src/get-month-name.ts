/**
 * Returns the localized name of a month for a given locale, format, and calendar.
 *
 * @param {string} locale - The locale to use for formatting the month name.
 * @param {number} month - The month (0 for January, 1 for February, etc.).
 * @param {'short' | 'narrow' | 'long'} [format='long'] - The format to use for the month name.
 * @param {'gregory' | 'islamic'} [calendar='gregory'] - The calendar to use for formatting the month name.
 * @returns {string} The localized name of the month.
 *
 * @example
 * console.log(getMonthName('en', 0)); // 'January'
 * console.log(getMonthName('ar', 0, 'long', 'islamic')); // 'محرم'
 */
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
