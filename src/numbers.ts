const currencyRegex = /^[A-Z]{3}$/;

export type Specifier = {
	s: string;
	currency: string | undefined;
	digits: number | undefined;
	localeIndependent: boolean;
	key: string;
};

export function parseNumberSpecifier(
	specifier: string,
	locale: string
): Specifier {
	const s = specifier[0];
	const currency = s === 'c' || s === 'C' ? specifier.slice(1, 4) : undefined;
	let i = 1;
	if (currency) {
		if (currency.length !== 3 || !currencyRegex.test(currency)) {
			throw new Error('Invalid currency code');
		}
		i = 4;
	}
	const digits =
		specifier.length > i ? parseInt(specifier.slice(i), 10) : undefined;
	if (
		digits !== undefined &&
		(Number.isNaN(digits) ||
			digits < 0 ||
			digits > 100 ||
			s === 'r' ||
			s === 'R')
	) {
		throw new Error(`Invalid number format specifier: ${specifier}`);
	}
	const localeIndependent = 'bBxXrR'.indexOf(s) >= 0;
	const key = localeIndependent
		? specifier === 'X'
			? 'X'
			: specifier.toLowerCase()
		: `${locale}/${specifier.toLowerCase()}`;
	return { s, currency, digits, localeIndependent, key };
}

export function getOptionsFromSpecifier(
	specifier: string,
	currency: string | undefined,
	digits: number | undefined
): Intl.NumberFormatOptions {
	if (specifier === 'c' || specifier === 'C') {
		return {
			style: 'currency',
			currencySign: 'accounting',
			currency: currency,
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
		};
	}

	if (specifier === 'd' || specifier === 'D') {
		return {
			useGrouping: false,
			minimumIntegerDigits: digits,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		};
	}

	if (specifier === 'e' || specifier === 'E') {
		return {
			style: 'decimal',
			notation: 'scientific',
			maximumFractionDigits: digits || 6,
			minimumFractionDigits: digits,
		};
	}

	if (specifier === 'f' || specifier === 'F') {
		return {
			style: 'decimal',
			maximumFractionDigits: digits ?? 2,
			minimumFractionDigits: digits ?? 2,
			useGrouping: false,
		};
	}

	if (specifier === 'n' || specifier === 'N') {
		return {
			style: 'decimal',
			maximumFractionDigits: digits,
			minimumFractionDigits: digits,
			useGrouping: true,
		};
	}

	if (specifier === 'g' || specifier === 'G') {
		return {
			style: 'decimal',
			notation: 'compact',
			maximumSignificantDigits: digits,
			useGrouping: false,
		};
	}

	if (specifier === 'p' || specifier === 'P') {
		return {
			style: 'percent',
			maximumFractionDigits: digits ?? 2,
			minimumFractionDigits: digits ?? 2,
			useGrouping: true,
		};
	}

	throw new Error(`Invalid number format specifier: ${specifier}`);
}
