export function languageName(locale: string, languageCode: string): string {
	const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
	return displayNames.of(languageCode);
}
