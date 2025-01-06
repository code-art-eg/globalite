export type NumberFormatter = (value: number) => string;

export function numberFormatter(
	locale: string,
	options?: Intl.NumberFormatOptions | string
): NumberFormatter {
	if (!options) {
		options = 'd';
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
	const s = specifier[0];
	const digits =
		specifier.length > 1 ? parseInt(specifier.slice(1), 10) : undefined;
	if (digits !== undefined && (Number.isNaN(digits) || digits < 0)) {
		throw new Error(`Invalid number format specifier: ${specifier}`);
	}
	const localeIndependent = 'bBxX'.indexOf(s) >= 0;
	const key = localeIndependent ? specifier : `${locale}/${specifier}`;

	let formatter = formatterCache.get(key);
	if (!formatter) {
		if (localeIndependent) {
			formatter = getLocaleIndependentFormatter(s, digits);
		} else {
			const options = getOptionsFromSpecifier(s, digits);
			formatter = Intl.NumberFormat(locale, options).format;
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
	if (specifier === 'b' || specifier === 'B') {
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

function getOptionsFromSpecifier(
	specifier: string,
	digits: number | undefined
): Intl.NumberFormatOptions {
	if (specifier === '' || specifier === 'd') {
		return {
			useGrouping: true,
			maximumFractionDigits: digits,
		};
	}

	// TODO: Implement this function
	throw new Error(`Invalid number format specifier: ${specifier}`);
}
