export function getTimeSeparator(locale: string): string {
	const formatter = new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: 'numeric',
	});
	const parts = formatter.formatToParts(new Date());
	return parts.find(part => part.type === 'literal')?.value || ':';
}

export function getDecimalSeparator(locale: string): string {
	const formatter = new Intl.NumberFormat(locale);
	const parts = formatter.formatToParts(1.1);
	return parts.find(part => part.type === 'decimal')?.value || '.';
}

export function getPlusSign(locale: string): string {
	const formatter = new Intl.NumberFormat(locale, {
		signDisplay: 'always',
	});
	const parts = formatter.formatToParts(1);
	return parts.find(part => part.type === 'plusSign')?.value || '+';
}

export function getMinusSign(locale: string): string {
	const formatter = new Intl.NumberFormat(locale, {
		signDisplay: 'always',
	});
	const parts = formatter.formatToParts(-1);
	return parts.find(part => part.type === 'minusSign')?.value || '-';
}
