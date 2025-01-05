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
	const key = `${locale}/${specifier}`;
	let formatter = formatterCache.get(key);
	if (!formatter) {
		const options = getOptionsFromSpecifier(specifier);
		formatter = Intl.NumberFormat(locale, options).format;
		formatterCache.set(key, formatter);
	}
	return formatter;
}

function getOptionsFromSpecifier(specifier: string): Intl.NumberFormatOptions {
	if (specifier === '' || specifier === 'd') {
		return {};
	}

	// TODO: Implement this function
	throw new Error(`Invalid number format specifier: ${specifier}`);
}
