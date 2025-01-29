import { getOptionsFromSpecifier, parseNumberSpecifier } from './numbers';

/**
 * A function that formats a number and returns a string.
 *
 * @typedef {function(number): string} NumberFormatter
 */
export type NumberFormatter = (value: number) => string;

/**
 * Creates a number formatter function based on the specified locale.
 *
 * @param {string} locale - The locale to use for formatting.
 * @returns {NumberFormatter} A function that formats a number according to the specified locale.
 */
export function numberFormatter(locale: string): NumberFormatter;

/**
 * Creates a number formatter function based on the specified locale and specifier.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {string} specifier - The formatting specifier string.
 * @returns {NumberFormatter} A function that formats a number according to the specified locale and specifier.
 * @throws {Error} If the number format specifier is invalid.
 */
export function numberFormatter(
	locale: string,
	specifier: string
): NumberFormatter;

/**
 * Creates a number formatter function based on the specified locale and options.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {Intl.NumberFormatOptions} options - The formatting options.
 * @returns {NumberFormatter} A function that formats a number according to the specified locale and options.
 */
export function numberFormatter(
	locale: string,
	options: Intl.NumberFormatOptions
): NumberFormatter;

/**
 * Creates a number formatter function based on the specified locale, options, or specifier.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {string | Intl.NumberFormatOptions} [options] - The formatting options or specifier.
 * @returns {NumberFormatter} A function that formats a number according to the specified locale and options or specifier.
 */
export function numberFormatter(
	locale: string,
	options?: Intl.NumberFormatOptions | string
): NumberFormatter {
	if (!options) {
		options = 'n';
	}
	if (typeof options === 'string') {
		return getFormatterFromSpecifiers(locale, options);
	}
	const intl = new Intl.NumberFormat(locale, options);
	return intl.format.bind(intl);
}

const formatterCache = new Map<string, NumberFormatter>();

function getFormatterFromSpecifiers(
	locale: string,
	specifier: string
): NumberFormatter {
	const { s, currency, digits, localeIndependent, key } =
		parseNumberSpecifier(specifier, locale);

	let formatter = formatterCache.get(key);
	if (!formatter) {
		if (localeIndependent) {
			formatter = getLocaleIndependentFormatter(s, digits);
		} else {
			if (s === 'd' || s === 'D') {
				const options = getOptionsFromSpecifier(s, currency, digits);
				const intl = new Intl.NumberFormat(locale, options);
				const captured = intl.format.bind(intl);
				formatter = (value: number) => {
					throwIfNotInteger(value);
					return captured(value);
				};
			} else if (s === 'g' || s === 'G') {
				const fixedOptions: Intl.NumberFormatOptions = {
					style: 'decimal',
					maximumSignificantDigits: digits,
					maximumFractionDigits: 100,
					useGrouping: false,
				};
				const scientificOptions: Intl.NumberFormatOptions = {
					style: 'decimal',
					notation: 'scientific',
					maximumSignificantDigits: digits,
					maximumFractionDigits: 100,
					useGrouping: false,
				};
				const fixedIntl = new Intl.NumberFormat(locale, fixedOptions);
				const fixedFormatter = fixedIntl.format.bind(fixedIntl);
				const scientificIntl = new Intl.NumberFormat(
					locale,
					scientificOptions
				);
				const scientificFormatter =
					scientificIntl.format.bind(scientificIntl);

				formatter = (value: number) => {
					if (value === 0) {
						return fixedFormatter(value);
					}
					const fixed = fixedFormatter(value);
					const scientific = scientificFormatter(value);
					return fixed.length < scientific.length
						? fixed
						: scientific;
				};
			} else {
				const options = getOptionsFromSpecifier(s, currency, digits);
				const intl = new Intl.NumberFormat(locale, options);
				formatter = intl.format.bind(intl);
			}
		}
		formatterCache.set(key, formatter);
	}
	return formatter;
}

function throwIfNotInteger(value: number): void {
	if (!Number.isInteger(value)) {
		throw new Error('Number must be an integer');
	}
}

function getIntegerFormatter(
	radix: number,
	digits: number | undefined
): NumberFormatter {
	return value => {
		throwIfNotInteger(value);
		if (value < -2147483648) {
			throw new Error('Number is too small to be represented');
		}
		if (value < 0) {
			let result = '';
			for (let i = 0; i < 8; i++) {
				let byte = (value & 0xf).toString(radix);
				if (radix === 2) {
					byte = byte.padStart(4, '0');
				}
				result = byte + result;
				value = value >> 4;
			}
			return result;
		}

		return digits
			? value.toString(radix).padStart(digits, '0')
			: value.toString(radix);
	};
}

function getLocaleIndependentFormatter(
	specifier: string,
	digits: number | undefined
): NumberFormatter {
	if (specifier === 'r' || specifier === 'R') {
		return value => value.toString();
	} else if (specifier === 'b' || specifier === 'B') {
		return getIntegerFormatter(2, digits);
	} else if (specifier === 'x') {
		return getIntegerFormatter(16, digits);
	} else if (specifier === 'X') {
		const fmt = getIntegerFormatter(16, digits);
		return value => fmt(value).toUpperCase();
	}
	throw new Error(
		`Invalid locale-independent number format specifier: ${specifier}`
	);
}
