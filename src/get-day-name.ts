/**
 * Returns the localized name of a day of the week for a given locale and format.
 *
 * @param {string} locale - The locale to use for formatting the day name.
 * @param {number} day - The day of the week (0 for Sunday, 1 for Monday, etc.).
 * @param {'short' | 'narrow' | 'long'} [format='long'] - The format to use for the day name.
 * @returns {string} The localized name of the day.
 *
 * @example
 * console.log(getDayName('en', 0)); // 'Sunday'
 * console.log(getDayName('fr', 1, 'short')); // 'lun.'
 */
export function getDayName(
	locale: string,
	day: number,
	format: 'short' | 'narrow' | 'long' = 'long'
): string {
	const key = `${locale}/${format}`;
	let dayNames = dayNamesCache.get(key);
	if (!dayNames) {
		const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
		dayNames = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(2000, 0, i + 2); // January 2, 2000, is a Sunday
			return formatter.format(date);
		});

		dayNamesCache.set(key, dayNames);
	}

	return dayNames[day];
}

const dayNamesCache = new Map<string, string[]>();
