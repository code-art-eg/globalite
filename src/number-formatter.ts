import { getOptionsFromSpecifier, parseNumberSpecifier } from './numbers';

export type NumberFormatter = (value: number) => string;

/**
 * Creates a number formatter function based on the specified locale and options.
 *
 * @param {string} locale - The locale to use for formatting.
 * @param {Intl.NumberFormatOptions | string} [options] - The formatting options or specifier string.
 * @returns {NumberFormatter} A function that formats a number according to the specified locale and options.
 * @throws {Error} If the currency code in the specifier is invalid.
 * @throws {Error} If the number format specifier is invalid.
 *
 * Number format specifiers:
 * - `n` or `N`: Formats a number with grouping separators.
 * - `cUSD` or `CUSD`: Formats a number as currency with the specified currency code (USD).
 * - `d` or `D`: Formats a number as an integer with the specified number of digits.
 * - `e` or `E`: Formats a number in scientific notation with the specified number of digits.
 * - `f` or `F`: Formats a number as a fixed-point number with the specified number of digits.
 * - `g` or `G`: Formats a number in compact notation with the specified number of significant digits.
 * - `p` or `P`: Formats a number as a percentage with the specified number of digits.
 * - `b` or `B`: Formats a number in binary.
 * - `x`: Formats a number in hexadecimal.
 * - `X`: Formats a number in hexadecimal using uppercase letters.
 * - `r` or `R`: Formats a number as a string.
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
	return Intl.NumberFormat(locale, options).format;
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
				const captured = Intl.NumberFormat(locale, options).format;
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
				const fixedFormatter = Intl.NumberFormat(
					locale,
					fixedOptions
				).format;
				const scientificFormatter = Intl.NumberFormat(
					locale,
					scientificOptions
				).format;

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
				formatter = Intl.NumberFormat(locale, options).format;
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
