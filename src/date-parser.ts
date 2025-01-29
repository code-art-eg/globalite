import { getOptionsFromSpecifier, parseDateSpecifier } from './dates';
import { numberParser, NumberParser } from './number-parser';
import { compareStringsAtIndex } from './parse-util';

/**
 * A function that parses a date string and returns a Date object or null if parsing fails.
 *
 * @typedef {function(string): (Date | null)} DateParser
 */
export type DateParser = (date: string) => Date | null;

/**
 * Creates a date parser function based on the specified locale.
 *
 * @param {string} locale - The locale to use for parsing.
 * @returns {DateParser} A function that parses a date string according to the specified locale.
 */
export function dateParser(locale: string): DateParser;

/**
 * Creates a date parser function based on the specified locale and specifier.
 *
 * @param {string} locale - The locale to use for parsing.
 * @param {string} specifier - The parsing specifier string.
 * @param {string} [timeZone] - The time zone to use for parsing.
 * @returns {DateParser} A function that parses a date string according to the specified locale and specifier.
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
 */
export function dateParser(
	locale: string,
	specifier: string,
	timeZone?: string
): DateParser;
/**
 * Creates a date parser function based on the specified locale and options.
 *
 * @param {string} locale - The locale to use for parsing.
 * @param {Intl.NumberFormatOptions} options - The parsing options.
 * @returns {DateParser} A function that parses a date string according to the specified locale and options.
 */
export function dateParser(
	locale: string,
	options: Intl.NumberFormatOptions
): DateParser;

/**
 * Creates a date parser function based on the specified locale, options, or specifier.
 *
 * @param {string} locale - The locale to use for parsing.
 * @param {string | Intl.NumberFormatOptions} [options] - The parsing options or specifier.
 * @param {string} [timeZone] - The time zone to use for parsing.
 * @returns {DateParser} A function that parses a date string according to the specified locale and options or specifier.
 */
export function dateParser(
	locale: string,
	options?: string | Intl.NumberFormatOptions,
	timeZone?: string
): DateParser {
	if (!options) {
		options = 'f';
	}
	if (typeof options === 'string') {
		return getParserFromSpecifier(locale, options, timeZone);
	}
	return getDateParserFromOptions(locale, options);
}

const digitRx = /\p{Nd}/u;

export type NumberKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type ParserState = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	ms: number;

	isPM: boolean;
	isAM: boolean;

	input: string;
	index: number;
};

type Matcher = (state: ParserState) => boolean;

function getMonthMatcher(
	fmt: (d: Date) => Intl.DateTimeFormatPart[],
	parser: NumberParser
): Matcher {
	const months: string[] = [];
	for (let i = 0; i < 12; i++) {
		const date = new Date(2020, i, 1);
		const parts = fmt(date);

		const month = parts.find(part => part.type === 'month')?.value;

		if (!month) {
			throw new Error('Could not find month');
		}
		if (digitRx.test(month)) {
			return s => {
				return matchNumber(s, parser, 'month');
			};
		}
		months.push(month);
	}
	return s => {
		for (let i = 0; i < 12; i++) {
			const cmp = compareStringsAtIndex(months[i], s.input, s.index);
			if (cmp) {
				s.index = cmp;
				s.month = i + 1;
				return true;
			}
		}
		return false;
	};
}

function getDayOfWeekMatcher(
	fmt: (d: Date) => Intl.DateTimeFormatPart[]
): Matcher {
	const days: string[] = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(2020, 0, i + 1);
		const parts = fmt(date);

		const day = parts.find(part => part.type === 'weekday')?.value;
		if (!day) {
			throw new Error('Could not find day of week');
		}
		days.push(day.toLowerCase());
	}
	return s => {
		for (let i = 0; i < 7; i++) {
			const cmp = compareStringsAtIndex(days[i], s.input, s.index);
			if (cmp !== false) {
				s.index = cmp;
				return true;
			}
		}
		return false;
	};
}

function getDayPeriodMatcher(
	fmt: (d: Date) => Intl.DateTimeFormatPart[]
): Matcher {
	let date = new Date(2020, 0, 1, 2, 3, 4, 567);
	let parts = fmt(date);

	let period = parts.find(part => part.type === 'dayPeriod')?.value;
	if (!period) {
		throw new Error('Could not find day period');
	}
	const am = period.toLowerCase();

	date = new Date(2020, 0, 1, 14, 3, 4, 567);
	parts = fmt(date);

	period = parts.find(part => part.type === 'dayPeriod')?.value;
	if (!period) {
		throw new Error('Could not find day period');
	}
	const pm = period.toLowerCase();
	return s => {
		let cmp = compareStringsAtIndex(am, s.input, s.index);
		if (cmp !== false) {
			s.index = cmp;
			s.isAM = true;
			return true;
		}
		cmp = compareStringsAtIndex(pm, s.input, s.index);
		if (cmp !== false) {
			s.index = cmp;
			s.isPM = true;
			return true;
		}
		return false;
	};
}

function matchNumber(
	s: ParserState,
	parser: NumberParser,
	key: NumberKeys<ParserState>
): boolean {
	let str = '';
	while (s.index < s.input.length) {
		if (!digitRx.test(s.input[s.index])) {
			break;
		}
		str += s.input[s.index];
		s.index++;
	}
	if (str === '') {
		return false;
	}
	const num = parser(str);
	if (num === null) {
		return false;
	}
	s[key] = num;
	return true;
}

function getDateParserFromOptions(
	locale: string,
	options: Intl.DateTimeFormatOptions
): DateParser {
	const intl = new Intl.DateTimeFormat(locale, options);
	const formatter = intl.formatToParts.bind(intl);
	const parser = numberParser(locale, 'd');

	const optionsNoTimeZone = { ...options, timeZone: undefined };
	const intlNoTimeZone = new Intl.DateTimeFormat(locale, optionsNoTimeZone);
	const formatterNoTimeZone =
		intlNoTimeZone.formatToParts.bind(intlNoTimeZone);

	const monthMatcher = getMonthMatcher(formatterNoTimeZone, parser);

	const parts = formatter(new Date());

	let dayOfWeekMatcher: Matcher | undefined;
	let dayPeriodMatcher: Matcher | undefined;
	if (parts.some(part => part.type === 'weekday')) {
		dayOfWeekMatcher = getDayOfWeekMatcher(formatterNoTimeZone);
	}
	if (parts.some(part => part.type === 'dayPeriod')) {
		dayPeriodMatcher = getDayPeriodMatcher(formatterNoTimeZone);
	}

	return (str: string) => {
		const today = new Date();
		const state: ParserState = {
			year: today.getUTCFullYear(),
			month: 0,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			ms: 0,

			isPM: false,
			isAM: false,
			input: str,
			index: 0,
		};

		for (const part of parts) {
			switch (part.type) {
				case 'year':
					if (!matchNumber(state, parser, 'year')) {
						return null;
					}
					break;
				case 'month':
					if (!monthMatcher(state)) {
						return null;
					}
					break;
				case 'day':
					if (!matchNumber(state, parser, 'day')) {
						return null;
					}
					break;
				case 'hour':
					if (!matchNumber(state, parser, 'hour')) {
						return null;
					}
					break;
				case 'minute':
					if (!matchNumber(state, parser, 'minute')) {
						return null;
					}
					break;
				case 'second':
					if (!matchNumber(state, parser, 'second')) {
						return null;
					}
					break;
				case 'dayPeriod':
					if (!dayPeriodMatcher!(state)) {
						return null;
					}
					break;
				case 'weekday':
					if (!dayOfWeekMatcher!(state)) {
						return null;
					}
					break;
				default: {
					const cmp = compareStringsAtIndex(
						part.value,
						str,
						state.index
					);
					if (cmp === false) {
						return null;
					}
					state.index = cmp;
					break;
				}
			}
		}

		if (state.index !== str.length) {
			return null;
		}

		if (state.isPM && state.hour < 12) {
			state.hour += 12;
		}

		if (state.isAM && state.hour === 12) {
			state.hour = 0;
		}

		return new Date(
			state.year,
			state.month - 1,
			state.day,
			state.hour,
			state.minute,
			state.second,
			state.ms
		);
	};
}

const parserCache = new Map<string, DateParser>();

function getParserFromSpecifier(
	locale: string,
	specifier: string,
	timeZone?: string
): DateParser {
	const { s, localeIndependent, key } = parseDateSpecifier(specifier, locale);

	let parser = parserCache.get(key);
	if (!parser) {
		if (localeIndependent) {
			parser = getLocaleIndependentParser(s);
		} else {
			const options = getOptionsFromSpecifier(s);
			options.timeZone = timeZone;
			parser = getDateParserFromOptions(locale, options);
		}
		parserCache.set(key, parser);
	}
	return parser;
}

const dateRx: Record<string, RegExp> = {
	u: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})Z$/,
	s: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
	o: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?$/,
};

function getLocaleIndependentParser(specifier: string): DateParser {
	if (specifier === 'r' || specifier === 'R') {
		return (str: string) => {
			const date = new Date(str);
			if (isNaN(date.getTime())) {
				return null;
			}
			return date;
		};
	}
	const rx = dateRx[specifier.toLowerCase()];
	if (!rx) {
		throw new Error(`Invalid date format specifier: ${specifier}`);
	}

	return (str: string) => {
		const match = str.match(rx);
		if (!match) {
			return null;
		}
		const [, year, month, day, hours, minutes, seconds, ms] = match;

		const dateStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds ?? '00'}.${(ms ?? '000').padEnd(3, '0').slice(0, 3)}Z`;
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) {
			return null;
		}
		return date;
	};
}
