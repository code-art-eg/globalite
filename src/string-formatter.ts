import { numberFormatter } from './number-formatter';
import { booleanFormatter } from './boolean-formatter';
import { dateFormatter } from './date-formatter';

/**
 * Formats a string using the specified locale and format string, replacing placeholders with the provided arguments.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {string} format - The format string containing placeholders.
 * @param {...unknown} args - The arguments to replace the placeholders.
 * @returns {string} The formatted string.
 *
 * @remarks
 * The function behaves like .NET string.Format method
 * @example
 * console.log(formatString('en', 'Hello, {0}!', 'world')); // 'Hello, world!'
 * console.log(formatString('en', 'The date is {0:d}', new Date())); // 'The date is 10/31/2021'
 */
export function formatString(
	locale: string,
	format: string,
	...args: unknown[]
): string {
	let index = 0;
	let m = formatRx.exec(format);
	let res = '';
	while (m) {
		if (m.index > index) {
			res += format.substring(index, m.index);
		}
		const arg = evaluateArg(m[1], args);
		const formatSpecifier = m[2];
		res += formatValue(arg, locale, formatSpecifier);
		index = m.index + m[0].length;
		m = formatRx.exec(format);
	}
	if (index < format.length) {
		res += format.substring(index);
	}
	return res;
}

const formatRx = /{([^}:]+)(?::([^}]+))?}/g;

function evaluateArg(key: string, args: unknown[]): unknown {
	if (/^\d+$/.test(key)) {
		const n = parseInt(key, 10);
		return args[n];
	} else {
		const split = key.split('.');
		let arg = args && args[0];
		for (
			let i = 0;
			arg !== null && arg !== undefined && i < split.length;
			i++
		) {
			arg = (arg as Record<string, unknown>)[split[i]];
		}
		return arg;
	}
}

function formatValue(
	val: unknown,
	locale: string,
	formatSpecifier: string | null
): string {
	if (val === undefined) {
		return '';
	} else if (val === null) {
		return '';
	} else if (typeof val === 'string') {
		return val;
	} else if (typeof val === 'number') {
		const fmt =
			formatSpecifier === null
				? numberFormatter(locale)
				: numberFormatter(locale, formatSpecifier);
		return fmt(val);
	} else if (typeof val === 'boolean') {
		const fmt = booleanFormatter(locale);
		return fmt(val);
	} else if (val instanceof Date) {
		const fmt =
			formatSpecifier === null
				? dateFormatter(locale)
				: dateFormatter(locale, formatSpecifier);
		return fmt(val);
	}
	return val.toString();
}
