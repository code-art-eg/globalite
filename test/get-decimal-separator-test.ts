import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getDecimalSeparator } from '../src/format-util';

describe('getDecimalSeparator', () => {
	const testCases = [
		{ locale: 'en-US', expected: '.' },
		{ locale: 'de-DE', expected: ',' },
		{ locale: 'fr-FR', expected: ',' },
		{ locale: 'ar-EG', expected: '٫' },
		{ locale: 'ja-JP', expected: '.' },
	];

	testCases.forEach(({ locale, expected }) => {
		it(`should return the correct decimal separator for locale ${locale}`, () => {
			const result = getDecimalSeparator(locale);
			assert.strictEqual(result, expected);
		});
	});
});
