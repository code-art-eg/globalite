/**
 * Returns the localized name of a language given its locale and language code.
 *
 * @param {string} locale - The locale to use for formatting the language name.
 * @param {string} languageCode - The ISO 639-1 language code.
 * @returns {string} The localized language name or the language code if the name is not found.
 *
 * @example
 * console.log(languageName('en', 'fr')); // 'French'
 * console.log(languageName('es', 'en')); // 'inglés'
 */
export function languageName(locale: string, languageCode: string): string {
	const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
	return displayNames.of(languageCode) || languageCode;
}
