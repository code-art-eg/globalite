export function getDayName(
	locale: string,
	day: number,
	format: 'short' | 'narrow' | 'long' = 'long'
): string {
	const key = `${locale}/${format}`;
	let dayNames = dayNamesCache.get(key);
	if (!dayNames) {
		const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
		dayNames = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(2000, 0, i + 2); // January 2, 2000, is a Sunday
			return formatter.format(date);
		});

		dayNamesCache.set(key, dayNames);
	}

	return dayNames[day];
}

const dayNamesCache = new Map<string, string[]>();
