import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTimeSeparator } from '../src/format-util';

describe('getTimeSeparator', () => {
	const testCases = [
		{ locale: 'en-US', expected: ':' },
		{ locale: 'de-DE', expected: ':' },
		{ locale: 'fr-FR', expected: ':' },
		{ locale: 'ar-EG', expected: ':' },
		{ locale: 'ja-JP', expected: ':' },
	];

	testCases.forEach(({ locale, expected }) => {
		it(`should return the correct time separator for locale ${locale}`, () => {
			const result = getTimeSeparator(locale);
			assert.strictEqual(result, expected);
		});
	});
});
