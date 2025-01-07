import { getOptionsFromSpecifier, parseDateSpecifier } from './dates';

export type DateParser = (date: string) => Date | null;

export function dateParser(locale: string): DateParser;
export function dateParser(
	locale: string,
	specifier: string,
	timeZone?: string
): DateParser;
export function dateParser(
	locale: string,
	options: Intl.NumberFormatOptions
): DateParser;

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

function getDateParserFromOptions(
	locale: string,
	options: Intl.DateTimeFormatOptions
): DateParser {
	console.log(
		`getDateParserFromOptions: { locale: ${locale}, options: ${JSON.stringify(options)} }`
	);
	throw new Error('Not implemented');
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
