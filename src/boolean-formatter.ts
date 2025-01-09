import BOOLEAN_DATA from './boolean-data';

export type BooleanFormatter = (value: boolean) => string;

export function booleanFormatter(locale: string): BooleanFormatter {
	let formatter = formatterCache.get(locale);
	if (formatter === undefined) {
		formatter = getBooleanFormatter(locale);
		formatterCache.set(locale, formatter);
	}
	return formatter;
}

const formatterCache = new Map<string, BooleanFormatter>();

function getBooleanFormatter(locale: string): BooleanFormatter {
	const yesNo = BOOLEAN_DATA[locale];

	if (yesNo === undefined) {
		let index = locale.indexOf('-');
		while (index > 0) {
			locale = locale.substring(0, index);
			const val = BOOLEAN_DATA[locale];
			if (val !== undefined) {
				return getBooleanFormatter(locale);
			}
			index = locale.indexOf('-');
		}
		if (BOOLEAN_DATA[locale] === undefined) {
			return englishBooleanFormatter;
		}
	}
	const [yes, no] = yesNo.split(':');
	return (value: boolean) => (value ? yes : no);
}

function englishBooleanFormatter(value: boolean): string {
	return value ? 'yes' : 'no';
}
