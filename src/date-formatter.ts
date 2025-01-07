import { getOptionsFromSpecifier, parseDateSpecifier } from './dates';
import { numberFormatter } from './number-formatter';
import { numberParser } from './number-parser';

export type DateFormatter = (date: Date) => string;

/**
 * Creates a date formatter function based on the specified locale.
 *
 * @param {string} locale - The locale to use for formatting.
 * @returns {DateFormatter} A function that formats a date according to the specified locale.
 */
export function dateFormatter(locale: string): DateFormatter;

/**
 * Creates a date formatter function based on the specified locale and options.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {Intl.DateTimeFormatOptions} options - The formatting options.
 * @returns {DateFormatter} A function that formats a date according to the specified locale and options.
 */
export function dateFormatter(
	locale: string,
	options: Intl.DateTimeFormatOptions
): DateFormatter;

/**
 * Creates a date formatter function based on the specified locale and specifier.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {string} specifier - The formatting specifier string.
 * @param {string} timeZone - The time zone to use for formatting.
 * @returns {DateFormatter} A function that formats a date according to the specified locale and specifier.
 * @throws {Error} If the date format specifier is invalid.
 *
 * @remarks
 * The following are specifiers and values for 2008-07-31 15:30:45.678 using the de-DE locale
 * and Europe/Berlin time zone (DST GMT+2):
 * specifier: 'd' => '31.07.2008'
 * specifier: 'D' => 'Donnerstag, 31. Juli 2008'
 * specifier: 'f' => 'Donnerstag, 31. Juli 2008 um 15:30'
 * specifier: 'F' => 'Donnerstag, 31. Juli 2008 um 15:30:45'
 * specifier: 'g' => '31.07.2008 15:30'
 * specifier: 'G' => '31.07.2008 15:30:45'
 * specifier: 'm' => '31. Juli'
 * specifier: 'M' => '31. Juli'
 * specifier: 'o' => '2008-07-31T13:30:45.6780000'
 * specifier: 'O' => '2008-07-31T13:30:45.6780000'
 * specifier: 'r' => 'Thu, 31 Jul 2008 13:30:45 GMT'
 * specifier: 'R' => 'Thu, 31 Jul 2008 13:30:45 GMT'
 * specifier: 's' => '2008-07-31T13:30:45'
 * specifier: 'S' => '2008-07-31T13:30:45'
 * specifier: 't' => '15:30'
 * specifier: 'T' => '15:30:45'
 * specifier: 'u' => '2008-07-31 13:30:45Z'
 * specifier: 'U' => 'Donnerstag, 31. Juli 2008 13:30:45'
 * specifier: 'Y' => Oktober 2008
 *
 */
export function dateFormatter(
	locale: string,
	specifier: string,
	timeZone?: string
): DateFormatter;
export function dateFormatter(
	locale: string,
	optionsOrSpecifier?: string | Intl.DateTimeFormatOptions,
	timeZone?: string
): DateFormatter {
	if (!optionsOrSpecifier) {
		optionsOrSpecifier = 'f';
	}
	if (typeof optionsOrSpecifier === 'string') {
		return getFormatterFromSpecifier(locale, optionsOrSpecifier, timeZone);
	}

	const intl = new Intl.DateTimeFormat(locale, optionsOrSpecifier);
	const formatter = intl.format.bind(intl);
	return (date: Date) => formatter(date);
}

const formatterCache = new Map<string, DateFormatter>();

function getFormatterFromSpecifier(
	locale: string,
	specifier: string,
	timeZone?: string
): DateFormatter {
	const { s, localeIndependent, key } = parseDateSpecifier(
		specifier,
		locale,
		timeZone
	);

	let formatter = formatterCache.get(key);
	if (!formatter) {
		if (localeIndependent) {
			formatter = getLocaleIndependentFormatter(s);
		} else {
			const options = getOptionsFromSpecifier(s);
			options.timeZone = timeZone;
			const intl = new Intl.DateTimeFormat(locale, options);
			const captured = new Intl.DateTimeFormat(
				locale,
				options
			).formatToParts.bind(intl);
			const nFmt = numberFormatter(locale, 'd');
			const nPrs = numberParser(locale, 'd');
			formatter = (date: Date) => {
				const formatted = captured(date);
				return formatted.reduce((ac, cv) => {
					// We always need the year to be 4 digits
					if (cv.type === 'year') {
						const year = nPrs(cv.value) as number;
						if (year < 100) {
							let actualYear = date.getUTCFullYear();
							if (actualYear % 100 === 0 && year === 99) {
								actualYear -= 1;
							} else if (actualYear % 100 === 99 && year === 0) {
								actualYear += 1;
							}
							ac += nFmt(actualYear);
						} else {
							ac += cv.value;
						}
					} else {
						ac += cv.value;
					}
					return ac;
				}, '');
			};
		}
		formatterCache.set(key, formatter);
	}
	return formatter;
}

function getLocaleIndependentFormatter(specifier: string): DateFormatter {
	if (specifier === 'r' || specifier === 'R') {
		return (date: Date) => date.toUTCString();
	}
	if (specifier === 'u') {
		return (date: Date) => {
			const isoString = date.toISOString();
			return isoString.slice(0, 10) + ' ' + isoString.slice(11, 19) + 'Z';
		};
	}
	if (specifier === 's' || specifier === 'S') {
		return (date: Date) => {
			const isoString = date.toISOString();
			return isoString.slice(0, 19);
		};
	}
	if (specifier === 'o' || specifier === 'O') {
		return (date: Date) => {
			const isoString = date.toISOString();
			return isoString.slice(0, 23) + '0000';
		};
	}

	throw new Error(`Invalid date format specifier: ${specifier}`);
}
