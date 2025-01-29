import { numberFormatter, NumberFormatter } from './number-formatter';
import {
	getDecimalSeparator,
	getMinusSign,
	getPlusSign,
	getTimeSeparator,
} from './format-util';

export function durationFormatter(
	locale: string,
	format?: string
): NumberFormatter {
	let pattern = '[-][d:]h:mm[:ss[.FFF]]';

	if (format) {
		switch (format) {
			case 'constant':
				pattern = '[-]d:hh:mm:ss.fff';
				break;
			case 'short':
				pattern = '[-][d:]h:mm[:ss[.FFF]]';
				break;
			case 'long':
				pattern = '[-][d:]hh:mm:ss[.fff]';
				break;
			case 'racing':
				pattern = '[-][d:][h:]mm:ss.fff';
				break;
			default:
				pattern = format;
				break;
		}
	}

	const key = `${locale}/${pattern}`;

	let formatter = durationFormatterCache.get(key);
	if (formatter) {
		return formatter;
	}

	const parts = getParts(locale, pattern);

	formatter = (duration: number) => {
		if (isNaN(duration)) {
			return '';
		}
		if (!isFinite(duration)) {
			throw new Error(`Invalid duration`);
		}

		const neg = duration < 0;
		if (neg) {
			duration = -duration;
		}
		const d = Math.floor(duration / 86_400_000);
		duration = duration % 86400000;
		const h = Math.floor(duration / 3_600_000);
		duration = duration % 3600000;
		const m = Math.floor(duration / 60000);
		duration = duration % 60000;
		const s = Math.floor(duration / 1000);
		const ms = Math.round(duration % 1000);
		const [, result] = formatParts(parts, {
			days: d,
			hours: h,
			minutes: m,
			seconds: s,
			milliseconds: ms,
			negative: neg,
		});
		return result;
	};

	durationFormatterCache.set(key, formatter);
	return formatter;
}

const durationFormatterCache = new Map<string, NumberFormatter>();

type PartFormatter = (duration: Duration) => [boolean, string];

type Duration = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
	negative: boolean;
};

function countRepeat(s: string, index: number): number {
	let count = 0;
	for (let i = index; i < s.length; i++) {
		if (s[i] !== s[index]) {
			break;
		}
		count++;
	}
	return count;
}

function findSubPatternEnd(s: string, index: number): number {
	let count = 1;
	let nesting = 1;
	for (let i = index + 1; i < s.length; i++) {
		count++;
		if (s[i] === '[') {
			nesting++;
		}
		if (s[i] === ']') {
			nesting--;
		}
		if (nesting < 0) {
			throw new Error(`Invalid`);
		}
		if (nesting === 0) {
			return count;
		}
	}
	throw new Error(`Invalid`);
}

function findEndQuote(s: string, index: number): number {
	let count = 1;
	for (let i = index + 1; i < s.length; i++) {
		count++;
		if (s[i] === s[index]) {
			return count;
		}
	}
	throw new Error(`Invalid`);
}

function formatParts(
	parts: PartFormatter[],
	duration: Duration
): [boolean, string] {
	let result = '';
	let hasValue = false;
	for (let i = 0; i < parts.length; i++) {
		const [h, value] = parts[i](duration);
		if (h) {
			hasValue = true;
		}
		result += value;
	}
	return [hasValue, result];
}

function getParts(locale: string, pattern: string): PartFormatter[] {
	const result: PartFormatter[] = [];
	let tokenLength: number;
	for (let i = 0; i < pattern.length; i += tokenLength) {
		tokenLength = 1;
		const char = pattern[i];

		switch (char) {
			case 'd': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 8) {
					throw new Error(`Invalid duration pattern`);
				}
				const nf = numberFormatter(locale, 'd' + tokenLength);
				result.push(d => {
					return [d.days != 0, nf(d.days)];
				});
				break;
			}
			case 'h': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 2) {
					throw new Error(`Invalid duration pattern`);
				}
				const nf = numberFormatter(locale, 'd' + tokenLength);
				result.push(d => {
					return [d.hours != 0, nf(d.hours)];
				});
				break;
			}
			case 'm': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 2) {
					throw new Error(`Invalid duration pattern`);
				}
				const nf = numberFormatter(locale, 'd' + tokenLength);
				result.push(d => {
					return [d.minutes != 0, nf(d.minutes)];
				});
				break;
			}
			case 's': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 2) {
					throw new Error(`Invalid duration pattern`);
				}
				const nf = numberFormatter(locale, 'd' + tokenLength);
				result.push(d => {
					return [d.seconds != 0, nf(d.seconds)];
				});
				break;
			}
			case 'f': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 3) {
					throw new Error(`Invalid duration pattern`);
				}
				const pow = Math.pow(10, tokenLength);
				const nf = numberFormatter(locale, 'd' + tokenLength);
				result.push(d => {
					const ms = Math.round((d.milliseconds / 1000) * pow);
					return [ms != 0, nf(ms)];
				});
				break;
			}
			case 'F': {
				tokenLength = countRepeat(pattern, i);
				if (tokenLength > 3) {
					throw new Error(`Invalid duration pattern`);
				}
				const pow = Math.pow(10, tokenLength);
				const nf = numberFormatter(locale, 'd' + tokenLength);
				const zeroChar = nf(0)[1];
				result.push(d => {
					const ms = Math.round((d.milliseconds / 1000) * pow);
					let s = nf(ms);
					while (s.length > 0 && s[s.length - 1] === zeroChar) {
						s = s.slice(0, s.length - 1);
					}
					return [s.length != 0, s];
				});
				break;
			}
			case "'":
			case '"':
				tokenLength = findEndQuote(pattern, i);
				result.push(() => [
					false,
					pattern.slice(i + 1, i + tokenLength - 1),
				]);
				break;
			case '\\':
				if (pattern.length < i + 2) {
					throw new Error(`Invalid duration pattern`);
				}
				tokenLength = 2;
				result.push(() => [false, pattern[i + 1]]);
				break;
			case '[': {
				tokenLength = findSubPatternEnd(pattern, i);
				const subPattern = pattern.slice(i + 1, i + tokenLength - 1);
				const subParts = getParts(locale, subPattern);
				result.push(d => {
					const [h, value] = formatParts(subParts, d);
					if (h) {
						return [true, value];
					}
					return [false, ''];
				});
				break;
			}
			case '+':
			case '-': {
				tokenLength = 1;
				const minusSign = getMinusSign(locale);
				const plusSign = getPlusSign(locale);
				result.push(d => {
					return [d.negative, d.negative ? minusSign : plusSign];
				});
				break;
			}
			case ':': {
				tokenLength = 1;
				const timeSeparator = getTimeSeparator(locale);
				result.push(() => [false, timeSeparator]);
				break;
			}
			case '.': {
				tokenLength = 1;
				const decimalSeparator = getDecimalSeparator(locale);
				result.push(() => [false, decimalSeparator]);
				break;
			}
			default:
				throw new Error(`Invalid duration pattern`);
		}
	}
	return result;
}
