/**
 * Returns the localized name of a language given its locale and language code.
 *
 * @param {string} locale - The locale to use for formatting the language name.
 * @param {string} languageCode - The ISO 639-1 language code.
 * @returns {string} The localized language name or the language code if the name is not found.
 *
 * @example
 * console.log(getLanguageName('en', 'fr')); // 'French'
 * console.log(getLanguageName('es', 'en')); // 'inglés'
 */
export function getLanguageName(locale: string, languageCode: string): string {
	const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
	return displayNames.of(languageCode) || languageCode;
}
