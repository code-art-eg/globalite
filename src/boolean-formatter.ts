import BOOLEAN_DATA from './boolean-data';

/**
 * @typedef {function(boolean): string} BooleanFormatter
 * A function that formats a boolean value to a string.
 * Use booleanFormatter to get a BooleanFormatter for a specific locale.
 */
export type BooleanFormatter = (value: boolean) => string;

/**
 * Returns a boolean formatter function for the specified locale.
 * The formatter function converts boolean values to localized strings.
 *
 * @param {string} locale - The locale to use for formatting.
 * @returns {BooleanFormatter} The boolean formatter function.
 *
 * @example
 * const formatter = booleanFormatter('fr');
 * console.log(formatter(true)); // 'oui'
 * console.log(formatter(false)); // 'non'
 *
 * @remarks
 * If the locale is not found,
 * the function returns a formatter that uses English 'yes' and 'no' as the strings.
 */
export function booleanFormatter(locale: string): BooleanFormatter {
	let formatter = formatterCache.get(locale);
	if (formatter === undefined) {
		formatter = getBooleanFormatter(locale);
		formatterCache.set(locale, formatter);
	}
	return formatter;
}

const formatterCache = new Map<string, BooleanFormatter>();

function getBooleanFormatter(locale: string): BooleanFormatter {
	const yesNo = BOOLEAN_DATA[locale];

	if (yesNo === undefined) {
		let index = locale.indexOf('-');
		while (index > 0) {
			locale = locale.substring(0, index);
			const val = BOOLEAN_DATA[locale];
			if (val !== undefined) {
				return getBooleanFormatter(locale);
			}
			index = locale.indexOf('-');
		}
		if (BOOLEAN_DATA[locale] === undefined) {
			return englishBooleanFormatter;
		}
	}
	const [yes, no] = yesNo.split(':');
	return (value: boolean) => (value ? yes : no);
}

function englishBooleanFormatter(value: boolean): string {
	return value ? 'yes' : 'no';
}
