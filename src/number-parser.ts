import { getEndsWithRe, getStartsWithRe, looseMatch } from './parse-util';
import { getOptionsFromSpecifier, parseNumberSpecifier } from './numbers';

export type NumberParser = (value: string) => number | null;

/**
 * Creates a number parsing function based on the specified locale and options.
 *
 * @param {string} locale - The locale to use for parsing.
 * @param {Intl.NumberFormatOptions | string} [options] - The parsing options or specifier string.
 * @returns {NumberParser} A function that parsing a number according to the specified locale and options.
 * @throws {Error} If the currency code in the specifier is invalid.
 * @throws {Error} If the number format specifier is invalid.
 *
 * Number format specifiers:
 * - `n` or `N`: Formats a number with grouping separators.
 * - `cUSD` or `CUSD`: Formats a number as currency with the specified currency code (USD).
 * - `d` or `D`: Parses a number as an integer with the specified number of digits.
 * - `e` or `E`: Parses a number in scientific notation with the specified number of digits.
 * - `f` or `F`: Parses a number as a fixed-point number with the specified number of digits.
 * - `g` or `G`: Parses a number in compact notation with the specified number of significant digits.
 * - `p` or `P`: Parses a number as a percentage with the specified number of digits.
 * - `b` or `B`: Parses a number in binary.
 * - `x` or `X`: Parses a number in hexadecimal.
 * - `r` or `R`: Parses a number as a string (using parseFloat).
 */
export function numberParser(
	locale: string,
	options?: Intl.NumberFormatOptions | string
): NumberParser {
	if (!options) {
		options = 'n';
	}
	if (typeof options === 'string') {
		return getParserFromSpecifiers(locale, options);
	}
	return getNumberParserFromOptions(locale, options);
}

function getNumberParserFromOptions(
	locale: string,
	options: Intl.NumberFormatOptions
): NumberParser {
	const fmt = new Intl.NumberFormat(locale, options);
	const digits = getDigits(locale);

	const rules: Rule[] = [];

	rules.push(getRule(fmt, 123456789.12345679));
	rules.push(getRule(fmt, -123456789.12345679));
	rules.push(getRule(fmt, 1.23456789e40));
	rules.push(getRule(fmt, -1.23456789e40));
	rules.push(getRule(fmt, 1.23456789e-40));
	rules.push(getRule(fmt, -1.23456789e-40));
	rules.push(getRule(fmt, NaN));
	rules.push(getRule(fmt, Infinity));
	rules.push(getRule(fmt, -Infinity));

	return (value: string) => {
		const str = looseMatch(value);
		for (const rule of rules) {
			const [match, numStr] = matchRule(str, rule);
			if (match) {
				if (rule.isNaN) {
					return NaN;
				}
				if (rule.isInfinity) {
					return rule.isNegative ? -Infinity : Infinity;
				}
				const n = processRule(numStr, rule, digits);
				if (n !== null) {
					return n;
				}
			}
		}
		return null;
	};
}

const digitsMap = new Map<string, string[]>();
const parserCache = new Map<string, NumberParser>();

function getParserFromSpecifiers(
	locale: string,
	specifier: string
): NumberParser {
	const { s, currency, digits, localeIndependent, key } =
		parseNumberSpecifier(specifier, locale);

	let parser = parserCache.get(key);
	if (!parser) {
		if (localeIndependent) {
			parser = getLocaleIndependentParser(s);
		} else {
			if (s === 'g' || s === 'G') {
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
				const fixedParser = getNumberParserFromOptions(
					locale,
					fixedOptions
				);
				const scientificParser = getNumberParserFromOptions(
					locale,
					scientificOptions
				);

				parser = (value: string) => {
					const fixed = fixedParser(value);
					if (fixed === null) {
						return scientificParser(value);
					}
					return fixed;
				};
			} else {
				const options = getOptionsFromSpecifier(s, currency, digits);
				parser = getNumberParserFromOptions(locale, options);
			}
		}
		parserCache.set(key, parser);
	}
	return parser;
}

function getLocaleIndependentParser(specifier: string): NumberParser {
	if (specifier === 'x' || specifier === 'X') {
		return (value: string) => {
			const n = parseInt(value, 16);
			return isNaN(n) ? null : n;
		};
	}
	if (specifier === 'r' || specifier === 'R') {
		return (value: string) => {
			const n = parseInt(value, 10);
			return isNaN(n) ? null : n;
		};
	}
	if (specifier === 'b' || specifier === 'B') {
		return (value: string) => {
			const n = parseInt(value, 2);
			return isNaN(n) ? null : n;
		};
	}
	throw new Error(
		`Invalid locale-independent number format specifier: ${specifier}`
	);
}

type ParserState = {
	index: number;
	inString: string;
	outString: string;
	isLastDigit: boolean;
	isLastGroup: boolean;
	hasDecimal: boolean;
	hasExponent: boolean;
	hasExponentSign: boolean;
};

type BooleanKeys<T> = {
	[K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

type Rule = {
	properties: ParseProperties;
	isNegative: boolean;
	isNaN: boolean;
	isInfinity: boolean;
	isPercent: boolean;
};

type ParseProperties = {
	prefixRx?: RegExp;
	suffixRx?: RegExp;
	numberRx?: RegExp;
	groupSymbol?: string;
	decimalSymbol?: string;
	exponentSymbol?: string;
	exponentMinusSymbol?: string;
};

function getRule(fmt: Intl.NumberFormat, n: number): Rule {
	const parts = fmt.formatToParts(n);
	const properties = getParseProperties(parts);
	return {
		properties,
		isNegative: n < 0,
		isNaN: isNaN(n),
		isInfinity: !isFinite(n),
		isPercent: fmt.resolvedOptions().style === 'percent',
	};
}

function processRule(str: string, rule: Rule, digits: string[]): number | null {
	const state: ParserState = {
		index: 0,
		outString: '',
		isLastDigit: false,
		isLastGroup: false,
		hasDecimal: false,
		hasExponent: false,
		hasExponentSign: false,
		inString: str,
	};

	while (state.index < str.length) {
		if (consumeDigit(state, digits)) {
			continue;
		}
		if (state.isLastGroup) {
			// group symbol can only be followed by a digit
			return null;
		}
		if (state.hasExponent) {
			// the only non-digit character allowed in the exponent is the sign
			if (state.hasExponentSign) {
				return null;
			}

			if (
				consumeSymbol(
					state,
					rule.properties.exponentMinusSymbol,
					'hasExponentSign',
					'-'
				)
			) {
				state.isLastDigit = true;
				continue;
			}
			return null;
		}

		if (state.hasDecimal) {
			// the only non-digit character allowed after the decimal is the exponent
			if (
				consumeSymbol(
					state,
					rule.properties.exponentSymbol,
					'hasExponent',
					'e'
				)
			) {
				continue;
			}
			return null;
		}

		if (state.isLastDigit) {
			if (
				consumeSymbol(
					state,
					rule.properties.groupSymbol,
					'isLastGroup',
					''
				)
			) {
				state.isLastGroup = true;
				continue;
			}
		}
		if ((state.isLastDigit || state.index === 0) && !state.hasDecimal) {
			if (
				consumeSymbol(
					state,
					rule.properties.decimalSymbol,
					'hasDecimal',
					'.'
				)
			) {
				continue;
			}
		}

		return null;
	}

	const ns = state.outString;
	let n = parseFloat(ns);
	if (isNaN(n)) {
		return null;
	}

	if (rule.isPercent) {
		n /= 100;
	}

	if (rule.isNegative) {
		n = -n;
	}
	return n;
}

function consumeDigit(state: ParserState, digits: string[]): boolean {
	const index = digits.indexOf(state.inString[state.index]);
	if (index === -1) {
		return false;
	}
	state.index += digits[index].length;
	state.isLastGroup = false;
	state.isLastDigit = true;
	state.outString += index.toString();
	return true;
}

function consumeSymbol(
	state: ParserState,
	symbol: string | undefined,
	key: BooleanKeys<ParserState>,
	stdSymbol: string
): boolean {
	if (!symbol) {
		return false;
	}
	if (
		state.inString
			.slice(state.index, state.index + symbol.length)
			.toLowerCase() === symbol.toLowerCase()
	) {
		state.index += symbol.length;
		state[key] = true;
		state.outString += stdSymbol;
		state.isLastGroup = false;
		state.isLastDigit = false;
		return true;
	}

	return false;
}

function matchRule(str: string, rule: Rule): [boolean, string] {
	if (rule.properties.prefixRx) {
		const match = rule.properties.prefixRx.exec(str);
		if (!match) {
			return [false, str];
		}
		str = str.slice(match[0].length);
	}

	if (rule.properties.suffixRx) {
		const match = rule.properties.suffixRx.exec(str);
		if (!match) {
			return [false, str];
		}
		str = str.slice(0, -match[0].length);
	}

	if (rule.properties.numberRx) {
		const match = rule.properties.numberRx.exec(str);
		if (!match) {
			return [false, str];
		}
		return [true, match[0]];
	}

	return [true, str];
}

function getParseProperties(parts: Intl.NumberFormatPart[]): ParseProperties {
	let index = 0;
	let prefix = '';
	let suffix = '';
	const props: ParseProperties = {};

	while (index < parts.length) {
		const part = parts[index];
		if (isPartOfNumber(part)) {
			break;
		}
		prefix += part.value;
		index++;
	}

	if (prefix) {
		props.prefixRx = getStartsWithRe(looseMatch(prefix));
	}
	// index is now at the first part of the number
	// should not be at the end of the parts array
	if (isPartNanOrInfinity(parts[index])) {
		props.numberRx = getStartsWithRe(looseMatch(parts[index].value));
		index++;
	} else {
		while (index < parts.length && isPartOfNumber(parts[index])) {
			if (parts[index].type === 'group') {
				props.groupSymbol = parts[index].value;
			} else if (parts[index].type === 'decimal') {
				props.decimalSymbol = parts[index].value;
			} else if (parts[index].type === 'exponentSeparator') {
				props.exponentSymbol = parts[index].value;
			} else if (parts[index].type === 'exponentMinusSign') {
				props.exponentMinusSymbol = parts[index].value;
			}

			index++;
		}
	}

	while (index < parts.length) {
		const part = parts[index];
		suffix += part.value;
		index++;
	}

	if (suffix) {
		props.suffixRx = getEndsWithRe(looseMatch(suffix));
	}

	return props;
}

function isPartOfNumber(part: Intl.NumberFormatPart): boolean {
	return (
		part.type === 'integer' ||
		part.type === 'fraction' ||
		part.type === 'decimal' ||
		part.type === 'group' ||
		part.type === 'exponentSeparator' ||
		part.type === 'exponentInteger' ||
		part.type === 'exponentMinusSign' ||
		part.type === 'nan' ||
		part.type === 'infinity'
	);
}

function isPartNanOrInfinity(part: Intl.NumberFormatPart): boolean {
	return part.type === 'nan' || part.type === 'infinity';
}

function getDigits(locale: string): string[] {
	let digits = digitsMap.get(locale);
	if (!digits) {
		const fmt = new Intl.NumberFormat(locale, {});
		digits = Array.from({ length: 10 }, (_, i) => fmt.format(i));
		digitsMap.set(locale, digits);
	}
	return digits;
}
