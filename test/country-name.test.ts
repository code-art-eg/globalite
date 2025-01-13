import { describe, it } from 'node:test';

import { countryName } from '@code-art-eg/globalite';
import assert from 'node:assert/strict';

describe('countryName', () => {
	const testCases = [
		{ locale: 'en', countryCode: 'DE', expected: 'Germany' },
		{ locale: 'de', countryCode: 'DE', expected: 'Deutschland' },
		{ locale: 'ar', countryCode: 'DE', expected: 'ألمانيا' },
		{ locale: 'en', countryCode: 'FR', expected: 'France' },
		{ locale: 'de', countryCode: 'FR', expected: 'Frankreich' },
		{ locale: 'ar', countryCode: 'FR', expected: 'فرنسا' },
	];

	testCases.forEach(({ locale, countryCode, expected }) => {
		it(`should return the correct country name for locale ${locale} and country code ${countryCode}`, () => {
			assert.strictEqual(countryName(locale, countryCode), expected);
		});
	});
});
