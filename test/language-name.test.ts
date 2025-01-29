import { getLanguageName } from '@code-art-eg/globalite';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('languageName', () => {
	const testCases = [
		{ locale: 'en', languageCode: 'de', expected: 'German' },
		{ locale: 'de', languageCode: 'de', expected: 'Deutsch' },
		{ locale: 'ar', languageCode: 'de', expected: 'الألمانية' },
		{ locale: 'en', languageCode: 'fr', expected: 'French' },
		{ locale: 'de', languageCode: 'fr', expected: 'Französisch' },
		{ locale: 'ar', languageCode: 'fr', expected: 'الفرنسية' },
	];

	testCases.forEach(({ locale, languageCode, expected }) => {
		it(`should return the correct language name for locale ${locale} and language code ${languageCode}`, () => {
			const result = getLanguageName(locale, languageCode);
			assert.strictEqual(result, expected);
		});
	});
});
