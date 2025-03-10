import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPlusSign, getMinusSign } from '../src/format-util';

describe('getPlusSign', () => {
	const testCases = [
		{ locale: 'en-US', expected: '+' },
		{ locale: 'ar-EG', expected: '+' },
		{ locale: 'fr-FR', expected: '+' },
	];

	testCases.forEach(({ locale, expected }) => {
		it(`should return the correct plus sign for locale ${locale}`, () => {
			const result = getPlusSign(locale);
			assert.strictEqual(result, expected);
		});
	});
});

describe('getMinusSign', () => {
	const testCases = [
		{ locale: 'en-US', expected: '-' },
		{ locale: 'ar-EG', expected: '-' },
		{ locale: 'fr-FR', expected: '-' },
	];

	testCases.forEach(({ locale, expected }) => {
		it(`should return the correct minus sign for locale ${locale}`, () => {
			const result = getMinusSign(locale);
			assert.strictEqual(result, expected);
		});
	});
});
